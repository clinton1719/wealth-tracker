package com.backend.wealth_tracker.dto.update_dto;

import com.backend.wealth_tracker.enums.AccountType;
import jakarta.validation.constraints.NotNull;


public class UpdateAccountDTO {
  @NotNull(message = "Account ID cannot be null")
  private Long accountId;

  private String accountName;
  private String accountDescription;

  private AccountType accountType;

  public Long getAccountId() {
    return accountId;
  }

  public void setAccountId(Long accountId) {
    this.accountId = accountId;
  }

  public String getAccountName() {
    return accountName;
  }

  public void setAccountName(String accountName) {
    this.accountName = accountName;
  }

  public String getAccountDescription() {
    return accountDescription;
  }

  public void setAccountDescription(String accountDescription) {
    this.accountDescription = accountDescription;
  }

  public AccountType getAccountType() {
    return accountType;
  }

  public void setAccountType(AccountType accountType) {
    this.accountType = accountType;
  }
}
