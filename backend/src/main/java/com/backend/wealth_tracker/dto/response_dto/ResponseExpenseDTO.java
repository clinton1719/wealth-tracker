package com.backend.wealth_tracker.dto.response_dto;

import com.backend.wealth_tracker.model.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

@SuppressWarnings("PMD.DataClass")
public class ResponseExpenseDTO {
  @NotNull private Long id;
  @NotBlank private Category category;
  @NotNull private BigDecimal amount;
  @NotBlank private String description;
  @NotNull private LocalDate createdAt;
  @NotNull private LocalDate updatedAt;
  @NotNull private Long profileId;
  @NotNull private Long accountId;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
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
      throw new IllegalArgumentException("Category cannot be null for expense response.");
    }
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public void setAmount(BigDecimal amount) {
    this.amount = amount;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
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

  public Long getProfileId() {
    return profileId;
  }

  public void setProfileId(Long profileId) {
    this.profileId = profileId;
  }

  public Long getAccountId() {
    return accountId;
  }

  public void setAccountId(Long accountId) {
    this.accountId = accountId;
  }
}
