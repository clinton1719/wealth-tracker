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
@SuppressWarnings("PMD.DataClass")
public class Account implements Serializable {

  @Serial private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String accountName;

  private String description;

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
    this.id = originalAccount.id;
    this.accountName = originalAccount.accountName;
    this.description = originalAccount.description;
    this.accountBalance = originalAccount.accountBalance;
    this.accountType = originalAccount.accountType;
    this.user = originalAccount.user;
    this.expenses = originalAccount.expenses;
    this.profile = originalAccount.profile;
  }

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
        + id
        + ", accountName='"
        + accountName
        + '\''
        + ", description='"
        + description
        + '\''
        + ", accountBalance="
        + accountBalance
        + ", accountType="
        + accountType
        + ", user="
        + user
        + ", expenses="
        + expenses
        + ", profile="
        + profile
        + '}';
  }
}
