package com.backend.wealth_tracker.dto.response_dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.YearMonth;

public class ResponseTagMonthlyExpenseDTO {
  @NotBlank private String tag;
  @NotNull private YearMonth month;
  @NotNull private BigDecimal expenseAmount;
  @NotNull private Long profileId;

  public ResponseTagMonthlyExpenseDTO(
      String tag, YearMonth month, BigDecimal expenseAmount, Long profileId) {
    this.tag = tag;
    this.month = month;
    this.expenseAmount = expenseAmount;
    this.profileId = profileId;
  }

  public String getTag() {
    return tag;
  }

  public void setTag(String tag) {
    this.tag = tag;
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
