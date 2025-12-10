package com.backend.wealth_tracker.dto.update_dto;

import com.backend.wealth_tracker.enums.AccountType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

@SuppressWarnings("PMD.DataClass")
public class UpdateAccountDTO {
  @NotNull(message = "Account ID cannot be null")
  private Long accountId;

  private String accountName;
  private String accountDescription;
  @PositiveOrZero(message = "Account balance cannot be negative")
  private BigDecimal accountBalance;
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
}
