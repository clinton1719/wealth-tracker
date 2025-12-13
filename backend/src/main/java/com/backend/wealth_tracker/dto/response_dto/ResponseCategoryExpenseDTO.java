package com.backend.wealth_tracker.dto.response_dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@SuppressWarnings("PMD.DataClass")
public class ResponseCategoryExpenseDTO implements Comparable<ResponseCategoryExpenseDTO>{
    @NotBlank
    private String categoryName;
    @NotNull
    private String categoryColorCode;
    private String categoryIcon;
    @NotNull
    private BigDecimal expenseAmount;

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryColorCode() {
        return categoryColorCode;
    }

    public void setCategoryColorCode(String categoryColorCode) {
        this.categoryColorCode = categoryColorCode;
    }

    public String getCategoryIcon() {
        return categoryIcon;
    }

    public void setCategoryIcon(String categoryIcon) {
        this.categoryIcon = categoryIcon;
    }

    public BigDecimal getExpenseAmount() {
        return expenseAmount;
    }

    public void setExpenseAmount(BigDecimal expenseAmount) {
        this.expenseAmount = expenseAmount;
    }

    @Override
    public int compareTo(ResponseCategoryExpenseDTO responseCategoryExpenseDTO) {
        return this.getExpenseAmount().compareTo(responseCategoryExpenseDTO.getExpenseAmount());
    }
}
