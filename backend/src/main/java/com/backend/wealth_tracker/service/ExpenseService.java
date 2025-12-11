package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.request_dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateExpenseDTO;
import com.backend.wealth_tracker.exception.AccountCannotHaveNegativeBalanceException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.exception.UnAuthorizedException;
import com.backend.wealth_tracker.helper.Helper;
import com.backend.wealth_tracker.mapper.ExpenseMapper;
import com.backend.wealth_tracker.model.*;
import com.backend.wealth_tracker.repository.AccountRepository;
import com.backend.wealth_tracker.repository.CategoryRepository;
import com.backend.wealth_tracker.repository.ExpenseRepository;
import com.backend.wealth_tracker.repository.ProfileRepository;
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
  private final ProfileRepository profileRepository;
  private final AccountRepository accountRepository;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public ExpenseService(
      ExpenseRepository expenseRepository,
      AuthService authService,
      AccountService accountService,
      CategoryRepository categoryRepository,
      ProfileRepository profileRepository,
      AccountRepository accountRepository) {
    this.categoryRepository = categoryRepository;
    this.authService = authService;
    this.accountService = accountService;
    this.expenseRepository = expenseRepository;
    this.profileRepository = profileRepository;
    this.accountRepository = accountRepository;
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public Expense saveExpense(CreateExpenseDTO createExpenseDTO, String userName)
      throws ResourceNotFoundException,
          UnAuthorizedException,
          AccountCannotHaveNegativeBalanceException {
    User user = this.authService.getUserByUsername(userName);
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
    this.accountService.debitAccount(
        createExpenseDTO.getAccountId(), createExpenseDTO.getExpenseAmount());
    Expense expense = setRequiredFieldsInExpense(createExpenseDTO);
    Expense savedExpense = this.expenseRepository.save(expense);
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
    setCategoryIfPresent(createExpenseDTO.getCategoryId(), expense);
    setAccountIfPresent(createExpenseDTO.getAccountId(), expense);
    setProfileIfPresent(createExpenseDTO.getProfileId(), expense);
    return expense;
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public Expense updateExpense(UpdateExpenseDTO updateExpenseDTO, String userName)
      throws ResourceNotFoundException,
          UnAuthorizedException,
          AccountCannotHaveNegativeBalanceException {
    User user = this.authService.getUserByUsername(userName);
    if (!Helper.isCategoryIdValid(user.getCategories(), updateExpenseDTO.getCategoryId())) {
      LOGGER
          .atError()
          .log(
              "Expense to be updated had illegal category ID: {}",
              updateExpenseDTO.getCategoryId());
      throw new UnAuthorizedException("Illegal id (profile | account | category) in account");
    }
    Optional<Expense> expenseOptional =
        this.expenseRepository.findById(updateExpenseDTO.getExpenseId());
    if (expenseOptional.isEmpty()) {
      throw new ResourceNotFoundException(
          "Expense not found for id: " + updateExpenseDTO.getExpenseId());
    }
    Expense expense = expenseOptional.get();
    BigDecimal oldExpenseAmount = expense.getExpenseAmount();
    BigDecimal newExpenseAmount = updateExpenseDTO.getExpenseAmount();
    BigDecimal differenceAmount = newExpenseAmount.subtract(oldExpenseAmount);
    if (differenceAmount.compareTo(BigDecimal.ZERO) < 0) {
      this.accountService.creditAccount(
          expense.getAccount().getAccountId(), differenceAmount.abs());
    } else if (differenceAmount.compareTo(BigDecimal.ZERO) > 0) {
      this.accountService.debitAccount(expense.getAccount().getAccountId(), differenceAmount.abs());
    }
    checkIfBelongsToProfile(updateExpenseDTO, expense);
    updateExpenseValues(updateExpenseDTO, expense);
    Expense updatedExpense = this.expenseRepository.save(expense);
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

  private void updateExpenseValues(UpdateExpenseDTO updateExpenseDTO, Expense expense)
      throws ResourceNotFoundException {
    if (updateExpenseDTO.getExpenseDescription() != null) {
      expense.setExpenseDescription(updateExpenseDTO.getExpenseDescription());
    }
    if (updateExpenseDTO.getExpenseAmount() != null) {
      expense.setExpenseAmount(updateExpenseDTO.getExpenseAmount());
    }
    setCategoryIfPresent(updateExpenseDTO.getCategoryId(), expense);
  }

  private void setAccountIfPresent(Long accountId, Expense expense)
      throws ResourceNotFoundException {
    if (accountId != null) {
      Account account =
          accountRepository
              .findById(accountId)
              .orElseThrow(
                  () -> new ResourceNotFoundException("Account not found for id: " + accountId));
      expense.setAccount(account);
    }
  }

  private void setCategoryIfPresent(Long categoryId, Expense expense)
      throws ResourceNotFoundException {
    if (categoryId != null) {
      Category category =
          categoryRepository
              .findById(categoryId)
              .orElseThrow(
                  () -> new ResourceNotFoundException("Category not found for id: " + categoryId));
      expense.setCategory(category);
    }
  }

  private void setProfileIfPresent(Long profileId, Expense expense)
      throws ResourceNotFoundException {
    if (profileId != null) {
      Profile profile =
          profileRepository
              .findById(profileId)
              .orElseThrow(
                  () -> new ResourceNotFoundException("Profile not found for ID: " + profileId));
      expense.setProfile(profile);
    }
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public void deleteExpense(Long id) throws ResourceNotFoundException {
    Optional<Expense> expenseOptional = this.expenseRepository.findById(id);
    if (expenseOptional.isEmpty()) {
      throw new ResourceNotFoundException("Expense not found for id: " + id);
    }
    this.accountService.creditAccount(
        expenseOptional.get().getAccount().getAccountId(),
        expenseOptional.get().getExpenseAmount());
    this.expenseRepository.delete(expenseOptional.get());
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
    List<Expense> expenses = this.expenseRepository.findByCreatedAtBetween(start, end, pageable);
    LOGGER.atInfo().log("Found {} expenses between {} and {}", expenses.size(), startDate, endDate);
    return expenses;
  }
}
