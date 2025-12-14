package com.backend.wealth_tracker.dto.response_dto;

import java.math.BigDecimal;
import java.time.YearMonth;

public class ResponseCategoryMonthlyExpenseDTO {
    private String categoryName;
    private String categoryColorCode;
    private YearMonth month;
    private BigDecimal expenseAmount;
    private Long profileId;

    public ResponseCategoryMonthlyExpenseDTO(String categoryName, String categoryColorCode, YearMonth month, BigDecimal expenseAmount, Long profileId) {
        this.categoryName = categoryName;
        this.categoryColorCode = categoryColorCode;
        this.month = month;
        this.expenseAmount = expenseAmount;
        this.profileId = profileId;
    }

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

    public YearMonth getMonth() {
        return month;
    }

    public void setMonth(YearMonth month) {
        this.month = month;
    }

    public BigDecimal getExpenseAmount() {
        return expenseAmount;
    }

    public void setExpenseAmount(BigDecimal expenseAmount) {
        this.expenseAmount = expenseAmount;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }
}
