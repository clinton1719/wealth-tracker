package com.backend.wealth_tracker.dto.update_dto;

import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class UpdateExpenseDTO {
    @NotNull
    private Long id;
    private Long categoryId;
    private BigDecimal amount;
    private String description;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
