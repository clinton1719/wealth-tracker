package com.backend.wealth_tracker.expense.service;

import com.backend.wealth_tracker.dto.update_dto.UpdateExpenseDTO;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.account.model.Account;
import com.backend.wealth_tracker.category.model.Category;
import com.backend.wealth_tracker.expense.model.Expense;
import com.backend.wealth_tracker.profile.model.Profile;
import com.backend.wealth_tracker.account.repository.AccountRepository;
import com.backend.wealth_tracker.category.repository.CategoryRepository;
import com.backend.wealth_tracker.profile.repository.ProfileRepository;
import org.springframework.stereotype.Service;

@Service
public class ExpenseTransactionService {
  private final ProfileRepository profileRepository;
  private final AccountRepository accountRepository;
  private final CategoryRepository categoryRepository;

  public ExpenseTransactionService(
      ProfileRepository profileRepository,
      AccountRepository accountRepository,
      CategoryRepository categoryRepository) {
    this.profileRepository = profileRepository;
    this.accountRepository = accountRepository;
    this.categoryRepository = categoryRepository;
  }

  public void updateExpenseValues(UpdateExpenseDTO updateExpenseDTO, Expense expense)
      throws ResourceNotFoundException {
    if (updateExpenseDTO.getExpenseDescription() != null) {
      expense.setExpenseDescription(updateExpenseDTO.getExpenseDescription());
    }
    if (updateExpenseDTO.getExpenseAmount() != null) {
      expense.setExpenseAmount(updateExpenseDTO.getExpenseAmount());
    }
    setCategoryIfPresent(updateExpenseDTO.getCategoryId(), expense);
  }

  public void setAccountIfPresent(Long accountId, Expense expense)
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

  public void setCategoryIfPresent(Long categoryId, Expense expense)
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

  public void setProfileIfPresent(Long profileId, Expense expense)
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
}
