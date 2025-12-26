package com.backend.wealth_tracker.model;

import com.backend.wealth_tracker.enums.AccountType;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "accounts")
public class Account implements Serializable {

  @Serial private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long accountId;

  @Column(nullable = false)
  private String accountName;

  private String accountDescription;

  @Column(nullable = false)
  @PositiveOrZero(message = "Account balance cannot be negative")
  private BigDecimal accountBalance;

  @Column(nullable = false)
  private AccountType accountType;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @OneToMany(mappedBy = "account")
  private Set<Expense> expenses;

  @ManyToOne
  @JoinColumn(name = "profile_id")
  private Profile profile;

  public Account() {}

  public Account(Account originalAccount) {
    this.accountId = originalAccount.accountId;
    this.accountName = originalAccount.accountName;
    this.accountDescription = originalAccount.accountDescription;
    this.accountBalance = originalAccount.accountBalance;
    this.accountType = originalAccount.accountType;
    this.user = originalAccount.user;
    this.expenses = originalAccount.expenses;
    this.profile = originalAccount.profile;
  }

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

  public User getUser() {
    if (user == null) {
      return null;
    }
    return new User(user);
  }

  public void setUser(User user) {
    if (user != null) {
      this.user = new User(user);
    } else {
      throw new IllegalArgumentException("User cannot be null for account");
    }
  }

  public Set<Expense> getExpenses() {
    if (expenses == null) {
      return Set.of();
    }
    return new HashSet<>(expenses);
  }

  public void setExpenses(Set<Expense> expenses) {
    if (this.expenses == null) {
      this.expenses = new HashSet<>();
    }
    if (expenses != null) {
      this.expenses.clear();
      this.expenses.addAll(expenses);
    } else {
      this.expenses.clear();
    }
  }

  public Profile getProfile() {
    if (profile == null) {
      return null;
    }
    return new Profile(profile);
  }

  public void setProfile(Profile profile) {
    if (profile != null) {
      this.profile = new Profile(profile);
    } else {
      throw new IllegalArgumentException("Profile cannot be null for account");
    }
  }

  @Override
  public String toString() {
    return "Account{"
        + "id="
        + accountId
        + ", accountName='"
        + accountName
        + '\''
        + ", description='"
        + accountDescription
        + '\''
        + ", accountBalance="
        + accountBalance
        + ", accountType="
        + accountType
        + ", user="
        + user
        + ", profile="
        + profile
        + '}';
  }
}
