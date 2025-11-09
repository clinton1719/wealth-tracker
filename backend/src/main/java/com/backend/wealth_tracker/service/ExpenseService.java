package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.ResponseExpenseDTO;
import com.backend.wealth_tracker.dto.UpdateExpenseDTO;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.mapper.ExpenseMapper;
import com.backend.wealth_tracker.model.Expense;
import com.backend.wealth_tracker.repository.ExpenseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ExpenseService {
    private final Logger LOGGER = LoggerFactory.getLogger(ExpenseService.class);

    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public ResponseExpenseDTO getExpense(Long id) throws ResourceNotFoundException {
        Optional<Expense> expenseOptional =  this.expenseRepository.findById(id);
        if (expenseOptional.isEmpty()) {
            throw new ResourceNotFoundException("Expense not found for id: " + id);
        }
        LOGGER.info("Expense found for id: {}", expenseOptional.get().getId());
        return ExpenseMapper.toResponseDto(expenseOptional.get());
    }

    public ResponseExpenseDTO saveExpense(CreateExpenseDTO createExpenseDTO) {
        Expense expense = this.expenseRepository.save(ExpenseMapper.createDTOtoEntity(createExpenseDTO));
        LOGGER.info("Expense created with id: {}", expense.getId());
        return ExpenseMapper.toResponseDto(expense);
    }

    public ResponseExpenseDTO updateExpense(UpdateExpenseDTO updateExpenseDTO) throws ResourceNotFoundException {
        Optional<Expense> expenseOptional =  this.expenseRepository.findById(updateExpenseDTO.getId());
        if (expenseOptional.isEmpty()) {
            throw new ResourceNotFoundException("Expense not found for id: " + updateExpenseDTO.getId());
        }
        Expense expense = expenseOptional.get();
        if (updateExpenseDTO.getDescription() != null) {
            expense.setDescription(updateExpenseDTO.getDescription());
        }
        if (updateExpenseDTO.getCategory() != null) {
            expense.setCategory(updateExpenseDTO.getCategory());
        }
        if (updateExpenseDTO.getAmount() != null) {
            expense.setAmount(updateExpenseDTO.getAmount());
        }

        Expense updatedExpense = this.expenseRepository.save(expense);
        LOGGER.info("Expense updated for id: {}", updatedExpense.getId());
        return ExpenseMapper.toResponseDto(updatedExpense);
    }

    public void deleteExpense(Long id) throws ResourceNotFoundException {
        Optional<Expense> expenseOptional =  this.expenseRepository.findById(id);
        if (expenseOptional.isEmpty()) {
            throw new ResourceNotFoundException("Expense not found for id: " + id);
        }
        this.expenseRepository.delete(expenseOptional.get());
        LOGGER.info("Expense deleted for id: {}", id);
    }
}
