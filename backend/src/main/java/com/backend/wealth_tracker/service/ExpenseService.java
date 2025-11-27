package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.request_dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateExpenseDTO;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.mapper.ExpenseMapper;
import com.backend.wealth_tracker.model.Account;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.Expense;
import com.backend.wealth_tracker.model.Profile;
import com.backend.wealth_tracker.repository.AccountRepository;
import com.backend.wealth_tracker.repository.CategoryRepository;
import com.backend.wealth_tracker.repository.ExpenseRepository;
import com.backend.wealth_tracker.repository.ProfileRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class ExpenseService {
  private final Logger LOGGER = LoggerFactory.getLogger(ExpenseService.class);

  private final ExpenseRepository expenseRepository;
  private final AuthService authService;
  private final CategoryRepository categoryRepository;
  private final ProfileRepository profileRepository;
  private final AccountRepository accountRepository;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public ExpenseService(
      ExpenseRepository expenseRepository,
      AuthService authService,
      CategoryRepository categoryRepository,
      ProfileRepository profileRepository,
      AccountRepository accountRepository) {
    this.categoryRepository = categoryRepository;
    this.authService = authService;
    this.expenseRepository = expenseRepository;
    this.profileRepository = profileRepository;
    this.accountRepository = accountRepository;
  }

  public Expense saveExpense(CreateExpenseDTO createExpenseDTO, String userName)
      throws ResourceNotFoundException {
    Optional<Category> categoryOptional =
        this.categoryRepository.findById(createExpenseDTO.getCategoryId());
    if (categoryOptional.isEmpty()) {
      throw new ResourceNotFoundException(
          "Category not found for id: " + createExpenseDTO.getCategoryId());
    }
    Expense expense = ExpenseMapper.createDTOtoExpense(createExpenseDTO, categoryOptional.get());
    expense.setUser(this.authService.getUserByUsername(userName));
    Expense savedExpense = this.expenseRepository.save(expense);
    LOGGER.atInfo().log("Expense created with id: {}", savedExpense.getId());
    return savedExpense;
  }

  public Expense updateExpense(UpdateExpenseDTO updateExpenseDTO) throws ResourceNotFoundException {
    Optional<Expense> expenseOptional = this.expenseRepository.findById(updateExpenseDTO.getId());
    if (expenseOptional.isEmpty()) {
      throw new ResourceNotFoundException("Expense not found for id: " + updateExpenseDTO.getId());
    }
    Expense expense = expenseOptional.get();
    updateExpenseValues(updateExpenseDTO, expense);

    Expense updatedExpense = this.expenseRepository.save(expense);
    LOGGER.atInfo().log("Expense updated for id: {}", updatedExpense.getId());
    return updatedExpense;
  }

  private void updateExpenseValues(UpdateExpenseDTO updateExpenseDTO, Expense expense)
      throws ResourceNotFoundException {
    if (updateExpenseDTO.getDescription() != null) {
      expense.setDescription(updateExpenseDTO.getDescription());
    }

    setCategoryIfPresent(updateExpenseDTO.getCategoryId(), expense);

    if (updateExpenseDTO.getAmount() != null) {
      expense.setAmount(updateExpenseDTO.getAmount());
    }

    setProfileIfPresent(updateExpenseDTO.getProfileId(), expense);

    setAccountIfPresent(updateExpenseDTO.getAccountId(), expense);
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

  public void deleteExpense(Long id) throws ResourceNotFoundException {
    Optional<Expense> expenseOptional = this.expenseRepository.findById(id);
    if (expenseOptional.isEmpty()) {
      throw new ResourceNotFoundException("Expense not found for id: " + id);
    }
    this.expenseRepository.delete(expenseOptional.get());
    LOGGER.atInfo().log("Expense deleted for id: {}", id);
  }

  public List<Expense> getExpensesInRange(
      UserDetails userDetails,
      String startDate,
      String endDate,
      Integer pageNumber,
      Integer pageSize) {
    LocalDate start = LocalDate.parse(startDate);
    LocalDate end = LocalDate.parse(endDate);
    Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());
    List<Expense> expenses = this.expenseRepository.findByCreatedAtBetween(start, end, pageable);
    LOGGER.atInfo().log("Found {} expenses between {} and {}", expenses.size(), startDate, endDate);
    return expenses;
  }
}
