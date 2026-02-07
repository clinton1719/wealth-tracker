package com.backend.wealth_tracker.expense.model;

import com.backend.wealth_tracker.account.model.Account;
import com.backend.wealth_tracker.auth.model.User;
import com.backend.wealth_tracker.category.model.Category;
import com.backend.wealth_tracker.profile.model.Profile;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import java.io.Serial;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity(name = "expenses")
@EntityListeners(AuditingEntityListener.class)
public class Expense implements Serializable {
  @Serial private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long expenseId;

  private String expenseDescription;

  @Column(nullable = false)
  @Positive
  private BigDecimal expenseAmount;

  @CreatedDate
  @Column(nullable = false, updatable = false)
  private LocalDate expenseCreatedAt;

  @LastModifiedDate
  @Column(nullable = false)
  private LocalDate expenseUpdatedAt;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne
  @JoinColumn(name = "category_id")
  private Category category;

  @ManyToOne
  @JoinColumn(name = "account_id")
  private Account account;

  @ManyToOne
  @JoinColumn(name = "profile_id")
  private Profile profile;

  public Long getExpenseId() {
    return expenseId;
  }

  public void setExpenseId(Long expenseId) {
    this.expenseId = expenseId;
  }

  public String getExpenseDescription() {
    return expenseDescription;
  }

  public void setExpenseDescription(String expenseDescription) {
    this.expenseDescription = expenseDescription;
  }

  public Category getCategory() {
    if (category == null) {
      return null;
    }
    return new Category(category);
  }

  public void setCategory(Category category) {
    if (category != null) {
      this.category = new Category(category);
    } else {
      throw new IllegalArgumentException("Category cannot be null for expense");
    }
  }

  public BigDecimal getExpenseAmount() {
    return expenseAmount;
  }

  public void setExpenseAmount(BigDecimal expenseAmount) {
    this.expenseAmount = expenseAmount;
  }

  public LocalDate getExpenseCreatedAt() {
    return expenseCreatedAt;
  }

  public void setExpenseCreatedAt(LocalDate expenseCreatedAt) {
    this.expenseCreatedAt = expenseCreatedAt;
  }

  public LocalDate getExpenseUpdatedAt() {
    return expenseUpdatedAt;
  }

  public void setExpenseUpdatedAt(LocalDate expenseUpdatedAt) {
    this.expenseUpdatedAt = expenseUpdatedAt;
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
      throw new IllegalArgumentException("User cannot be null for expense");
    }
  }

  public Account getAccount() {
    if (account == null) {
      return null;
    }
    return new Account(account);
  }

  public void setAccount(Account account) {
    if (account != null) {
      this.account = new Account(account);
    } else {
      throw new IllegalArgumentException("Account cannot be null for expense");
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
      throw new IllegalArgumentException("Profile cannot be null for expense");
    }
  }

  @Override
  public String toString() {
    return "Expense{"
        + "id="
        + expenseId
        + ", description='"
        + expenseDescription
        + '\''
        + ", amount="
        + expenseAmount
        + ", createdAt="
        + expenseCreatedAt
        + ", updatedAt="
        + expenseUpdatedAt
        + ", user="
        + user
        + ", category="
        + category
        + ", account="
        + account
        + ", profile="
        + profile
        + '}';
  }
}
