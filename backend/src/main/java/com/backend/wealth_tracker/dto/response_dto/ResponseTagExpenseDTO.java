package com.backend.wealth_tracker.dto.response_dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@SuppressWarnings("PMD.DataClass")
public class ResponseTagExpenseDTO implements Comparable<ResponseTagExpenseDTO> {
  @NotBlank private String tag;
  @NotNull private BigDecimal expenseAmount;
    @NotNull private Long profileId;

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

    @Override
  public int compareTo(ResponseTagExpenseDTO responseTagExpenseDTO) {
    return this.getExpenseAmount().compareTo(responseTagExpenseDTO.getExpenseAmount());
  }
}
