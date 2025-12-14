package com.backend.wealth_tracker.mapper;

import com.backend.wealth_tracker.dto.request_dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseCategoryExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseCategoryMonthlyExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseTagExpenseDTO;
import com.backend.wealth_tracker.model.Expense;
import com.backend.wealth_tracker.projections.CategoryExpenseSummaryProjection;
import com.backend.wealth_tracker.projections.CategoryMonthlyExpenseProjection;
import com.backend.wealth_tracker.projections.ExpenseSummaryProjection;
import com.backend.wealth_tracker.projections.TagExpenseSummaryProjection;

import java.time.YearMonth;
import java.util.Collections;
import java.util.List;

public final class ExpenseMapper {
    private ExpenseMapper() {
    }

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

    public static List<ResponseExpenseDTO> expenseSummaryProjectionsToResponseExpenseDTOs(
            List<ExpenseSummaryProjection> expenseSummaryProjectionList) {
        return expenseSummaryProjectionList.stream()
                .map(
                        projection ->
                                new ResponseExpenseDTO(
                                        projection.getExpenseId(),
                                        projection.getExpenseAmount(),
                                        projection.getExpenseDescription(),
                                        projection.getExpenseCreatedAt(),
                                        projection.getExpenseUpdatedAt(),
                                        projection.getCategoryId(),
                                        projection.getProfileId(),
                                        projection.getAccountId()))
                .toList();
    }

    public static List<ResponseCategoryExpenseDTO>
    categoryExpenseSummaryProjectionsToResponseCategoryExpenseDTOs(
            List<CategoryExpenseSummaryProjection> categoryExpenseSummaryProjectionList) {
        List<ResponseCategoryExpenseDTO> responseCategoryExpenseDTOList =
                new java.util.ArrayList<>(
                        categoryExpenseSummaryProjectionList.stream()
                                .map(
                                        projection ->
                                                new ResponseCategoryExpenseDTO(
                                                        projection.getCategoryName(),
                                                        projection.getCategoryColorCode(),
                                                        projection.getCategoryIcon(),
                                                        projection.getExpenseAmount(),
                                                        projection.getProfileId(),
                                                        projection.getProfileColorCode()))
                                .toList());
        Collections.sort(responseCategoryExpenseDTOList);
        return responseCategoryExpenseDTOList;
    }

    public static List<ResponseTagExpenseDTO>
    tagExpenseSummaryProjectionsToResponseCategoryExpenseDTOs(
            List<TagExpenseSummaryProjection> tagExpenseSummaryProjectionList) {
        List<ResponseTagExpenseDTO> responseTagExpenseDTOList =
                new java.util.ArrayList<>(
                        tagExpenseSummaryProjectionList.stream()
                                .map(
                                        projection ->
                                                new ResponseTagExpenseDTO(
                                                        projection.getTag(),
                                                        projection.getExpenseAmount(),
                                                        projection.getProfileId(),
                                                        projection.getProfileColorCode()))
                                .toList());
        Collections.sort(responseTagExpenseDTOList);
        return responseTagExpenseDTOList;
    }

    public static List<ResponseCategoryMonthlyExpenseDTO>
    categoryMonthlyExpenseProjectionsToResponseCategoryExpenseDTOs(
            List<CategoryMonthlyExpenseProjection> categoryMonthlyExpenseProjectionList) {
        return
                categoryMonthlyExpenseProjectionList.stream()
                        .map(
                                projection ->
                                        new ResponseCategoryMonthlyExpenseDTO(
                                                projection.getCategoryName(),
                                                projection.getCategoryColorCode(),
                                                YearMonth.from(projection.getMonth()),
                                                projection.getExpenseAmount(),
                                                projection.getProfileId()
                                        ))
                        .toList();
    }
}
