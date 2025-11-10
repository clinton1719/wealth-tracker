package com.backend.wealth_tracker.mapper;

import com.backend.wealth_tracker.dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.ResponseExpenseDTO;
import com.backend.wealth_tracker.model.Expense;

import java.util.List;

public class ExpenseMapper {
    public static ResponseExpenseDTO expenseToResponseExpenseDTO(Expense expense) {
        ResponseExpenseDTO dto = new ResponseExpenseDTO();
        dto.setDescription(expense.getDescription());
        dto.setAmount(expense.getAmount());
        dto.setCategory(expense.getCategory());
        dto.setCreatedAt(expense.getCreatedAt());
        dto.setUpdatedAt(expense.getUpdatedAt());
        dto.setId(expense.getId());
        return dto;
    }

    public static Expense createDTOtoExpense(CreateExpenseDTO dto) {
        Expense expense = new Expense();
        expense.setDescription(dto.getDescription());
        expense.setAmount(dto.getAmount());
        expense.setCategory(dto.getCategory());
        return expense;
    }

    public static List<ResponseExpenseDTO> expensesToResponseExpenseDTOs(List<Expense> expenses) {
        return expenses.stream()
                .map(ExpenseMapper::expenseToResponseExpenseDTO)
                .toList();
    }
}
