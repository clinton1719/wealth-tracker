package com.backend.wealth_tracker.dto.request_dto;

import com.backend.wealth_tracker.enums.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@SuppressWarnings("PMD.DataClass")
public class CreateAccountDTO {
  @NotBlank(message = "Account name cannot be blank")
  private String accountName;

  private String description;

  @NotNull(message = "Account balance cannot be null")
  private BigDecimal accountBalance;

  @NotNull(message = "Account type cannot be null")
  private AccountType accountType;

  @NotNull(message = "Profile id cannot be null")
  private Long profileId;

  public String getAccountName() {
    return accountName;
  }

  public void setAccountName(String accountName) {
    this.accountName = accountName;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public BigDecimal getAccountBalance() {
    return accountBalance;
  }

  public void setAccountBalance(BigDecimal accountBalance) {
    this.accountBalance = accountBalance;
  }

  public AccountType getAccountType() {
    return accountType;
  }

  public void setAccountType(AccountType accountType) {
    this.accountType = accountType;
  }

  public Long getProfileId() {
    return profileId;
  }

  public void setProfileId(Long profileId) {
    this.profileId = profileId;
  }
}
