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
    dto.setExpenseDescription(expense.getExpenseDescription());
    dto.setExpenseAmount(expense.getExpenseAmount());
    dto.setCategoryId(expense.getCategory().getCategoryId());
    dto.setAccountId(expense.getAccount().getAccountId());
    dto.setProfileId(expense.getProfile().getProfileId());
    dto.setExpenseCreatedAt(expense.getExpenseCreatedAt());
    dto.setExpenseUpdatedAt(expense.getExpenseUpdatedAt());
    dto.setExpenseId(expense.getExpenseId());
    return dto;
  }

  public static Expense createExpenseDTOtoExpense(CreateExpenseDTO dto) {
    Expense expense = new Expense();
    expense.setExpenseDescription(dto.getExpenseDescription());
    expense.setExpenseAmount(dto.getExpenseAmount());
    return expense;
  }

  public static List<ResponseExpenseDTO> expensesToResponseExpenseDTOs(List<Expense> expenses) {
    return expenses.parallelStream().map(ExpenseMapper::expenseToResponseExpenseDTO).toList();
  }
}
