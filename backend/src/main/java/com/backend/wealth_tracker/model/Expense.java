package com.backend.wealth_tracker.model;

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
@SuppressWarnings("PMD.DataClass")
public class Expense implements Serializable {
  @Serial private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String description;

  @Column(nullable = false)
  @Positive()
  private BigDecimal amount;

  @CreatedDate
  @Column(nullable = false, updatable = false)
  private LocalDate createdAt;

  @LastModifiedDate
  @Column(nullable = false)
  private LocalDate updatedAt;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "user_id")
  private User user;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "category_id")
  private Category category;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "account_id")
  private Account account;

  @ManyToOne(cascade = CascadeType.MERGE)
  @JoinColumn(name = "profile_id")
  private Profile profile;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
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

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public LocalDate getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(LocalDate createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDate getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(LocalDate updatedAt) {
    this.updatedAt = updatedAt;
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
}
