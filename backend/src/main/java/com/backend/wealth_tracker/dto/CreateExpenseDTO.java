package com.backend.wealth_tracker.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class CreateExpenseDTO {

    @NotNull
    private Long categoryId;
    @Positive
    private Double amount;
    private String description;

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
