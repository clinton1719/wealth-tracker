package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.request_dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateExpenseDTO;
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

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    private static final Logger LOGGER = LoggerFactory.getLogger(ExpenseService.class);

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

    @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
    public Expense saveExpense(CreateExpenseDTO createExpenseDTO, String userName)
            throws ResourceNotFoundException, UnAuthorizedException {
        User user = this.authService.getUserByUsername(userName);
        if (!Helper.isCategoryIdProfileIdAndAccountIdValid(user.getCategories(), createExpenseDTO.getCategoryId(), user.getProfiles(), createExpenseDTO.getProfileId(), user.getAccounts(), createExpenseDTO.getAccountId())) {
            LOGGER.atError().log("Expense to be saved had illegal profile ID: {} | category ID: {} | account ID: {}", createExpenseDTO.getProfileId(), createExpenseDTO.getCategoryId(), createExpenseDTO.getAccountId());
            throw new UnAuthorizedException("Illegal id (profile | account | category) in account");
        }
        Expense expense = setRequiredFieldsInExpense(createExpenseDTO);
        Expense savedExpense = this.expenseRepository.save(expense);
        LOGGER.atInfo().log("Expense to be saved created : {}", savedExpense);
        return savedExpense;
    }

    private Expense setRequiredFieldsInExpense(CreateExpenseDTO createExpenseDTO) throws ResourceNotFoundException {
        Expense expense = ExpenseMapper.createExpenseDTOtoExpense(createExpenseDTO);
        setCategoryIfPresent(createExpenseDTO.getCategoryId(), expense);
        setAccountIfPresent(createExpenseDTO.getAccountId(), expense);
        setProfileIfPresent(createExpenseDTO.getProfileId(), expense);
        return expense;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
    public Expense updateExpense(UpdateExpenseDTO updateExpenseDTO, String userName) throws ResourceNotFoundException, UnAuthorizedException {
        User user = this.authService.getUserByUsername(userName);
        if (!Helper.isCategoryIdProfileIdAndAccountIdValid(user.getCategories(), updateExpenseDTO.getCategoryId(), user.getProfiles(), updateExpenseDTO.getProfileId(), user.getAccounts(), updateExpenseDTO.getAccountId())) {
            LOGGER.atError().log("Expense to be updated had illegal profile ID: {} | category ID: {} | account ID: {}", updateExpenseDTO.getProfileId(), updateExpenseDTO.getCategoryId(), updateExpenseDTO.getAccountId());
            throw new UnAuthorizedException("Illegal id (profile | account | category) in account");
        }
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
        if (updateExpenseDTO.getAmount() != null) {
            expense.setAmount(updateExpenseDTO.getAmount());
        }
        setCategoryIfPresent(updateExpenseDTO.getCategoryId(), expense);
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

    @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
    public void deleteExpense(Long id) throws ResourceNotFoundException {
        Optional<Expense> expenseOptional = this.expenseRepository.findById(id);
        if (expenseOptional.isEmpty()) {
            throw new ResourceNotFoundException("Expense not found for id: " + id);
        }
        this.expenseRepository.delete(expenseOptional.get());
        LOGGER.atInfo().log("Expense deleted for id: {}", id);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED, propagation = Propagation.REQUIRED, readOnly = true)
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
