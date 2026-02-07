package com.backend.wealth_tracker.dto.response_dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/** DTOs treated as distinct instances despite identical values */
public class ResponseCategoryExpenseDTO {
  @NotBlank private String categoryName;
  @NotBlank private String categoryColorCode;
  private String categoryIcon;
  @NotNull private BigDecimal expenseAmount;
  @NotNull private Long profileId;
  @NotBlank private String profileColorCode;

  public ResponseCategoryExpenseDTO(
      String categoryName,
      String categoryColorCode,
      String categoryIcon,
      BigDecimal expenseAmount,
      Long profileId,
      String profileColorCode) {
    this.categoryName = categoryName;
    this.categoryColorCode = categoryColorCode;
    this.categoryIcon = categoryIcon;
    this.expenseAmount = expenseAmount;
    this.profileId = profileId;
    this.profileColorCode = profileColorCode;
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

  public Long getProfileId() {
    return profileId;
  }

  public void setProfileId(Long profileId) {
    this.profileId = profileId;
  }

  public String getProfileColorCode() {
    return profileColorCode;
  }

  public void setProfileColorCode(String profileColorCode) {
    this.profileColorCode = profileColorCode;
  }
}
