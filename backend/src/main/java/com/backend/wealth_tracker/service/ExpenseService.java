package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.UpdateExpenseDTO;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.mapper.ExpenseMapper;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.Expense;
import com.backend.wealth_tracker.repository.CategoryRepository;
import com.backend.wealth_tracker.repository.ExpenseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseService {
    private final Logger LOGGER = LoggerFactory.getLogger(ExpenseService.class);

    private final ExpenseRepository expenseRepository;

    private final AuthService authService;

    private final CategoryRepository categoryRepository;

    public ExpenseService(ExpenseRepository expenseRepository, AuthService authService, CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
        this.authService = authService;
        this.expenseRepository = expenseRepository;
    }

    public Expense saveExpense(CreateExpenseDTO createExpenseDTO, String userName) throws ResourceNotFoundException {
        Optional<Category> categoryOptional  = this.categoryRepository.findById(createExpenseDTO.getCategoryId());
        if (categoryOptional.isEmpty()) {
            throw new ResourceNotFoundException("Category not found for id: " + createExpenseDTO.getCategoryId());
        }
        Expense expense = ExpenseMapper.createDTOtoExpense(createExpenseDTO, categoryOptional.get());
        expense.setUser(this.authService.getUserByUsername(userName));
        Expense savedExpense = this.expenseRepository.save(expense);
        LOGGER.info("Expense created with id: {}", savedExpense.getId());
        return savedExpense;
    }

    public Expense updateExpense(UpdateExpenseDTO updateExpenseDTO) throws ResourceNotFoundException {
        Optional<Expense> expenseOptional = this.expenseRepository.findById(updateExpenseDTO.getId());
        if (expenseOptional.isEmpty()) {
            throw new ResourceNotFoundException("Expense not found for id: " + updateExpenseDTO.getId());
        }
        Expense expense = expenseOptional.get();
        if (updateExpenseDTO.getDescription() != null) {
            expense.setDescription(updateExpenseDTO.getDescription());
        }
        if (updateExpenseDTO.getCategoryId() != null) {
            Optional<Category> categoryOptional  = this.categoryRepository.findById(updateExpenseDTO.getCategoryId());
            if (categoryOptional.isEmpty()) {
                throw new ResourceNotFoundException("Category not found for id: " + updateExpenseDTO.getCategoryId());
            }
            expense.setCategory(categoryOptional.get());
        }
        if (updateExpenseDTO.getAmount() != null) {
            expense.setAmount(updateExpenseDTO.getAmount());
        }

        Expense updatedExpense = this.expenseRepository.save(expense);
        LOGGER.info("Expense updated for id: {}", updatedExpense.getId());
        return updatedExpense;
    }

    public void deleteExpense(Long id) throws ResourceNotFoundException {
        Optional<Expense> expenseOptional = this.expenseRepository.findById(id);
        if (expenseOptional.isEmpty()) {
            throw new ResourceNotFoundException("Expense not found for id: " + id);
        }
        this.expenseRepository.delete(expenseOptional.get());
        LOGGER.info("Expense deleted for id: {}", id);
    }

    public List<Expense> getExpensesInRange(UserDetails userDetails, String startDate, String endDate, Integer pageNumber, Integer pageSize) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("createdAt").descending());
        List<Expense> expenses = this.expenseRepository.findByCreatedAtBetween(start, end, pageable);
        LOGGER.info("Found {} expenses between {} and {}", expenses.size(), startDate, endDate);
        return expenses;
    }
}
