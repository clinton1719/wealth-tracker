package com.backend.wealth_tracker.dto.response_dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/** DTOs treated as distinct instances despite identical values */
@SuppressWarnings({"PMD.DataClass", "PMD.OverrideBothEqualsAndHashCodeOnComparable"})
public class ResponseTagExpenseDTO implements Comparable<ResponseTagExpenseDTO> {
  @NotBlank private String tag;
  @NotNull private BigDecimal expenseAmount;
  @NotNull private Long profileId;
  @NotBlank private String profileColorCode;

  public ResponseTagExpenseDTO(
      String tag, BigDecimal expenseAmount, Long profileId, String profileColorCode) {
    this.tag = tag;
    this.expenseAmount = expenseAmount;
    this.profileId = profileId;
    this.profileColorCode = profileColorCode;
  }

  public String getTag() {
    return tag;
  }

  public void setTag(String tag) {
    this.tag = tag;
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

  @Override
  public int compareTo(ResponseTagExpenseDTO responseTagExpenseDTO) {
    return this.getExpenseAmount().compareTo(responseTagExpenseDTO.getExpenseAmount());
  }
}
