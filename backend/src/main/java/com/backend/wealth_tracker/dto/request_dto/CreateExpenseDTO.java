package com.backend.wealth_tracker.dto.request_dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public class CreateExpenseDTO {

  @NotNull(message = "Category ID cannot be null")
  private Long categoryId;

  @Positive(message = "Expense amount cannot be negative")
  private BigDecimal amount;

  private String description;

  @NotNull(message = "Profile id cannot be null")
  private Long profileId;

  @NotNull(message = "Account id cannot be null")
  private Long accountId;

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

  public Long getProfileId() {
    return profileId;
  }

  public void setProfileId(Long profileId) {
    this.profileId = profileId;
  }

  public Long getAccountId() {
    return accountId;
  }

  public void setAccountId(Long accountId) {
    this.accountId = accountId;
  }
}
