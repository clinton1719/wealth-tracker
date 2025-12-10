package com.backend.wealth_tracker.mapper;

import com.backend.wealth_tracker.dto.request_dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseExpenseDTO;
import com.backend.wealth_tracker.model.Expense;

import java.util.List;

public final class ExpenseMapper {
  private ExpenseMapper() {}
  ;

  public static ResponseExpenseDTO expenseToResponseExpenseDTO(Expense expense) {
    ResponseExpenseDTO dto = new ResponseExpenseDTO();
    dto.setDescription(expense.getDescription());
    dto.setAmount(expense.getAmount());
    dto.setCategoryId(expense.getCategory().getCategoryId());
    dto.setAccountId(expense.getAccount().getId());
    dto.setProfileId(expense.getProfile().getId());
    dto.setCreatedAt(expense.getCreatedAt());
    dto.setUpdatedAt(expense.getUpdatedAt());
    dto.setId(expense.getId());
    return dto;
  }

  public static Expense createExpenseDTOtoExpense(CreateExpenseDTO dto) {
    Expense expense = new Expense();
    expense.setDescription(dto.getDescription());
    expense.setAmount(dto.getAmount());
    return expense;
  }

  public static List<ResponseExpenseDTO> expensesToResponseExpenseDTOs(List<Expense> expenses) {
    return expenses.parallelStream().map(ExpenseMapper::expenseToResponseExpenseDTO).toList();
  }
}
