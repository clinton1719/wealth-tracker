package com.backend.wealth_tracker.dto.request_dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

@SuppressWarnings("PMD.DataClass")
public class CreateExpenseDTO {

  @NotNull(message = "Category ID cannot be null")
  private Long categoryId;

  @Positive(message = "Expense amount cannot be negative")
  private BigDecimal expenseAmount;

  private String expenseDescription;

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

  @Override
  public String toString() {
    return "CreateExpenseDTO{"
        + "categoryId="
        + categoryId
        + ", amount="
        + expenseAmount
        + ", description='"
        + expenseDescription
        + '\''
        + ", profileId="
        + profileId
        + ", accountId="
        + accountId
        + '}';
  }
}
