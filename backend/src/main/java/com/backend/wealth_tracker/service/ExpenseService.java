package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.ResponseExpenseDTO;
import com.backend.wealth_tracker.dto.UpdateExpenseDTO;
import com.backend.wealth_tracker.mapper.ExpenseMapper;
import com.backend.wealth_tracker.model.Expense;
import com.backend.wealth_tracker.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;

    public ExpenseService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    public ResponseExpenseDTO getExpense(Long id) {
        Optional<Expense> expenseOptional =  this.expenseRepository.findById(id);
        if (expenseOptional.isEmpty()) {
            throw new RuntimeException("Expense not found");
        }
        return ExpenseMapper.toResponseDto(expenseOptional.get());
    }

    public ResponseExpenseDTO saveExpense(CreateExpenseDTO createExpenseDTO) {
        Expense expense =  this.expenseRepository.save(ExpenseMapper.createDTOtoEntity(createExpenseDTO));
        return ExpenseMapper.toResponseDto(expense);
    }

    public ResponseExpenseDTO updateExpense(UpdateExpenseDTO updateExpenseDTO) {
        Optional<Expense> expenseOptional =  this.expenseRepository.findById(updateExpenseDTO.getId());
        if (expenseOptional.isEmpty()) {
            throw new RuntimeException("Expense not found");
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
        return ExpenseMapper.toResponseDto(updatedExpense);
    }

    public void deleteExpense(Long id) {
        Optional<Expense> expenseOptional =  this.expenseRepository.findById(id);
        if (expenseOptional.isEmpty()) {
            throw new RuntimeException("Expense not found");
        }
        this.expenseRepository.delete(expenseOptional.get());
    }
}
