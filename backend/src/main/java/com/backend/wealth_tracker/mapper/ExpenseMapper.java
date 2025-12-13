package com.backend.wealth_tracker.mapper;

import com.backend.wealth_tracker.dto.request_dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseCategoryExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseTagExpenseDTO;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.Expense;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

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

  public static List<ResponseCategoryExpenseDTO> createResponseCategoryExpenseDTOFromMaps(
      Map<Long, BigDecimal> categoryExpenseMap, Map<Long, Category> categoryMap) {
    List<ResponseCategoryExpenseDTO> responseCategoryExpenseDTOList = new ArrayList<>();
    for (Map.Entry<Long, BigDecimal> entry : categoryExpenseMap.entrySet()) {
      ResponseCategoryExpenseDTO responseCategoryExpenseDTO = new ResponseCategoryExpenseDTO();
      Category category = categoryMap.get(entry.getKey());
      responseCategoryExpenseDTO.setCategoryName(category.getCategoryName());
      responseCategoryExpenseDTO.setCategoryColorCode(category.getCategoryColorCode());
      responseCategoryExpenseDTO.setCategoryIcon(category.getCategoryIcon());
      responseCategoryExpenseDTO.setExpenseAmount(entry.getValue());
      responseCategoryExpenseDTOList.add(responseCategoryExpenseDTO);
    }
    Collections.sort(responseCategoryExpenseDTOList);
    return responseCategoryExpenseDTOList;
  }

  public static List<ResponseTagExpenseDTO> createResponseTagExpenseDTOFromMaps(
      Map<String, BigDecimal> tagMap) {
    List<ResponseTagExpenseDTO> responseTagExpenseDTOList = new ArrayList<>();
    for (Map.Entry<String, BigDecimal> entry : tagMap.entrySet()) {
      ResponseTagExpenseDTO responseTagExpenseDTO = new ResponseTagExpenseDTO();
      responseTagExpenseDTO.setTag(entry.getKey());
      responseTagExpenseDTO.setExpenseAmount(entry.getValue());
      responseTagExpenseDTOList.add(responseTagExpenseDTO);
    }
    Collections.sort(responseTagExpenseDTOList);
    return responseTagExpenseDTOList;
  }
}
