package com.backend.wealth_tracker.dto.response_dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@SuppressWarnings("PMD.DataClass")
public class ResponseExpenseDTO {
  @NotNull private Long expenseId;
  @NotNull private BigDecimal expenseAmount;
  @NotBlank private String expenseDescription;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
  @NotNull
  private LocalDate expenseCreatedAt;

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
  @NotNull
  private LocalDate expenseUpdatedAt;

  @NotBlank private Long categoryId;
  @NotNull private Long profileId;
  @NotNull private Long accountId;

  public ResponseExpenseDTO() {}

  public ResponseExpenseDTO(
      Long expenseId,
      BigDecimal expenseAmount,
      String expenseDescription,
      LocalDate expenseCreatedAt,
      LocalDate expenseUpdatedAt,
      Long categoryId,
      Long profileId,
      Long accountId) {
    this.expenseId = expenseId;
    this.expenseAmount = expenseAmount;
    this.expenseDescription = expenseDescription;
    this.expenseCreatedAt = expenseCreatedAt;
    this.expenseUpdatedAt = expenseUpdatedAt;
    this.categoryId = categoryId;
    this.profileId = profileId;
    this.accountId = accountId;
  }

  public Long getExpenseId() {
    return expenseId;
  }

  public void setExpenseId(Long expenseId) {
    this.expenseId = expenseId;
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

  public LocalDate getExpenseCreatedAt() {
    return expenseCreatedAt;
  }

  public void setExpenseCreatedAt(LocalDate expenseCreatedAt) {
    this.expenseCreatedAt = expenseCreatedAt;
  }

  public LocalDate getExpenseUpdatedAt() {
    return expenseUpdatedAt;
  }

  public void setExpenseUpdatedAt(LocalDate expenseUpdatedAt) {
    this.expenseUpdatedAt = expenseUpdatedAt;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
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
