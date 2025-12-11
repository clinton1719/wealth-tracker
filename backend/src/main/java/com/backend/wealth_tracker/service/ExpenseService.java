package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.request_dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateExpenseDTO;
import com.backend.wealth_tracker.exception.AccountCannotHaveNegativeBalanceException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.exception.UnAuthorizedException;
import com.backend.wealth_tracker.helper.Helper;
import com.backend.wealth_tracker.mapper.ExpenseMapper;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.Expense;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.CategoryRepository;
import com.backend.wealth_tracker.repository.ExpenseRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ExpenseService {
  private static final Logger LOGGER = LoggerFactory.getLogger(ExpenseService.class);

  private final ExpenseRepository expenseRepository;
  private final AuthService authService;
  private final AccountService accountService;
  private final CategoryRepository categoryRepository;
  private final ExpenseTransactionService expenseTransactionService;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public ExpenseService(
      ExpenseRepository expenseRepository,
      AuthService authService,
      AccountService accountService,
      CategoryRepository categoryRepository,
      ExpenseTransactionService expenseTransactionService) {
    this.categoryRepository = categoryRepository;
    this.authService = authService;
    this.accountService = accountService;
    this.expenseRepository = expenseRepository;
    this.expenseTransactionService = expenseTransactionService;
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public Expense saveExpense(CreateExpenseDTO createExpenseDTO, String userName)
      throws ResourceNotFoundException,
          UnAuthorizedException,
          AccountCannotHaveNegativeBalanceException {
    User user = authService.getUserByUsername(userName);
    if (!Helper.isCategoryIdProfileIdAndAccountIdValid(
        user.getCategories(),
        createExpenseDTO.getCategoryId(),
        user.getProfiles(),
        createExpenseDTO.getProfileId(),
        user.getAccounts(),
        createExpenseDTO.getAccountId())) {
      LOGGER
          .atError()
          .log(
              "Expense to be saved had illegal profile ID: {} | category ID: {} | account ID: {}",
              createExpenseDTO.getProfileId(),
              createExpenseDTO.getCategoryId(),
              createExpenseDTO.getAccountId());
      throw new UnAuthorizedException("Illegal id (profile | account | category) in account");
    }
    accountService.debitAccount(
        createExpenseDTO.getAccountId(), createExpenseDTO.getExpenseAmount());
    Expense expense = setRequiredFieldsInExpense(createExpenseDTO);
    Expense savedExpense = expenseRepository.save(expense);
    if (!Objects.equals(
            savedExpense.getAccount().getProfile().getProfileId(), createExpenseDTO.getProfileId())
        || !Objects.equals(
            savedExpense.getCategory().getProfile().getProfileId(),
            createExpenseDTO.getProfileId())) {
      LOGGER
          .atError()
          .log(
              "Profile ID: {}, not consistent with that of account: {} and category: {}",
              createExpenseDTO.getProfileId(),
              savedExpense.getAccount().getProfile().getProfileId(),
              savedExpense.getCategory().getProfile().getProfileId());
      throw new UnAuthorizedException("Profile ID not consistent");
    }
    LOGGER.atInfo().log("Expense to be saved created : {}", savedExpense);
    return savedExpense;
  }

  private Expense setRequiredFieldsInExpense(CreateExpenseDTO createExpenseDTO)
      throws ResourceNotFoundException {
    Expense expense = ExpenseMapper.createExpenseDTOtoExpense(createExpenseDTO);
    expenseTransactionService.setCategoryIfPresent(createExpenseDTO.getCategoryId(), expense);
    expenseTransactionService.setAccountIfPresent(createExpenseDTO.getAccountId(), expense);
    expenseTransactionService.setProfileIfPresent(createExpenseDTO.getProfileId(), expense);
    return expense;
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public Expense updateExpense(UpdateExpenseDTO updateExpenseDTO, String userName)
      throws ResourceNotFoundException,
          UnAuthorizedException,
          AccountCannotHaveNegativeBalanceException {
    User user = authService.getUserByUsername(userName);
    if (!Helper.isCategoryIdValid(user.getCategories(), updateExpenseDTO.getCategoryId())) {
      LOGGER
          .atError()
          .log(
              "Expense to be updated had illegal category ID: {}",
              updateExpenseDTO.getCategoryId());
      throw new UnAuthorizedException("Illegal id (profile | account | category) in account");
    }
    Optional<Expense> expenseOptional = expenseRepository.findById(updateExpenseDTO.getExpenseId());
    if (expenseOptional.isEmpty()) {
      throw new ResourceNotFoundException(
          "Expense not found for id: " + updateExpenseDTO.getExpenseId());
    }
    Expense expense = expenseOptional.get();
    BigDecimal oldExpenseAmount = expense.getExpenseAmount();
    BigDecimal newExpenseAmount = updateExpenseDTO.getExpenseAmount();
    BigDecimal differenceAmount = newExpenseAmount.subtract(oldExpenseAmount);
    if (differenceAmount.compareTo(BigDecimal.ZERO) < 0) {
      accountService.creditAccount(expense.getAccount().getAccountId(), differenceAmount.abs());
    } else if (differenceAmount.compareTo(BigDecimal.ZERO) > 0) {
      accountService.debitAccount(expense.getAccount().getAccountId(), differenceAmount.abs());
    }
    checkIfBelongsToProfile(updateExpenseDTO, expense);
    expenseTransactionService.updateExpenseValues(updateExpenseDTO, expense);
    Expense updatedExpense = expenseRepository.save(expense);
    LOGGER.atInfo().log("Expense updated for id: {}", updatedExpense.getExpenseId());
    return updatedExpense;
  }

  private void checkIfBelongsToProfile(UpdateExpenseDTO updateExpenseDTO, Expense expense)
      throws ResourceNotFoundException, UnAuthorizedException {
    Optional<Category> category = categoryRepository.findById(updateExpenseDTO.getCategoryId());
    if (category.isEmpty()) {
      LOGGER.atError().log("Category not found to update expense: {}", updateExpenseDTO);
      throw new ResourceNotFoundException("Category not found");
    }
    if (!Objects.equals(
        category.get().getProfile().getProfileId(), expense.getProfile().getProfileId())) {
      LOGGER.atError().log("Invalid category for this profile: {}", updateExpenseDTO);
      throw new UnAuthorizedException("Invalid category");
    }
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public void deleteExpense(Long id) throws ResourceNotFoundException {
    Optional<Expense> expenseOptional = expenseRepository.findById(id);
    if (expenseOptional.isEmpty()) {
      throw new ResourceNotFoundException("Expense not found for id: " + id);
    }
    accountService.creditAccount(
        expenseOptional.get().getAccount().getAccountId(),
        expenseOptional.get().getExpenseAmount());
    expenseRepository.delete(expenseOptional.get());
    LOGGER.atInfo().log("Expense deleted for id: {}", id);
  }

  @Transactional(
      isolation = Isolation.READ_COMMITTED,
      propagation = Propagation.REQUIRED,
      readOnly = true)
  public List<Expense> getExpensesInRange(
      UserDetails userDetails,
      String startDate,
      String endDate,
      Integer pageNumber,
      Integer pageSize) {
    LocalDate start = LocalDate.parse(startDate);
    LocalDate end = LocalDate.parse(endDate);
    Pageable pageable =
        PageRequest.of(pageNumber, pageSize, Sort.by("expenseCreatedAt").descending());
    List<Expense> expenses = expenseRepository.findByCreatedAtBetween(start, end, pageable);
    LOGGER.atInfo().log("Found {} expenses between {} and {}", expenses.size(), startDate, endDate);
    return expenses;
  }
}
