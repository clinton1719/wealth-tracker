package com.backend.wealth_tracker.dto.update_dto;

import com.backend.wealth_tracker.enums.AccountType;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

@SuppressWarnings("PMD.DataClass")
public class UpdateAccountDTO {
  @NotNull(message = "Account ID cannot be null")
  private Long id;

  private String accountName;
  private String description;
  private BigDecimal accountBalance;
  private AccountType accountType;
  private Long profileId;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

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
