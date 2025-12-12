package com.backend.wealth_tracker.dto.update_dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@SuppressWarnings("PMD.DataClass")
public class UpdateExpenseDTO {
  @NotNull(message = "Expense ID cannot be null")
  private Long expenseId;

  private Long categoryId;
  private BigDecimal expenseAmount;
  private String expenseDescription;

  public Long getExpenseId() {
    return expenseId;
  }

  public void setExpenseId(Long expenseId) {
    this.expenseId = expenseId;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

  public BigDecimal getExpenseAmount() {
    return expenseAmount;
  }

  public void setExpenseAmount(BigDecimal expenseAmount) {
    this.expenseAmount = expenseAmount;
  }

  public String getExpenseDescription() {
    return expenseDescription;
  }

  public void setExpenseDescription(String expenseDescription) {
    this.expenseDescription = expenseDescription;
  }
}
