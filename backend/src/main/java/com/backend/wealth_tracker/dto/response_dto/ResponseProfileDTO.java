package com.backend.wealth_tracker.dto.response_dto;

import java.util.HashSet;
import java.util.Set;

@SuppressWarnings("PMD.DataClass")
public class ResponseProfileDTO {
  private Long id;
  private String profileName;
  private String description;
  private String colorCode;
  private String profilePicture;
  private Set<Long> accountIds;
  private Set<Long> categoryIds;
  private Set<Long> expenseIds;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getProfileName() {
    return profileName;
  }

  public void setProfileName(String profileName) {
    this.profileName = profileName;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getColorCode() {
    return colorCode;
  }

  public void setColorCode(String colorCode) {
    this.colorCode = colorCode;
  }

  public String getProfilePicture() {
    return profilePicture;
  }

  public void setProfilePicture(String profilePicture) {
    this.profilePicture = profilePicture;
  }

  public Set<Long> getAccountIds() {
    return Set.copyOf(accountIds);
  }

  public void setAccountIds(Set<Long> accountIds) {
    if (accountIds != null) {
      this.accountIds = new HashSet<>(accountIds);
    } else {
      this.accountIds = Set.of();
    }
  }

  public Set<Long> getCategoryIds() {
    return Set.copyOf(categoryIds);
  }

  public void setCategoryIds(Set<Long> categoryIds) {
    if (categoryIds != null) {
      this.categoryIds = new HashSet<>(categoryIds);
    } else {
      this.categoryIds = Set.of();
    }
  }

  public Set<Long> getExpenseIds() {
    return Set.copyOf(expenseIds);
  }

  public void setExpenseIds(Set<Long> expenseIds) {
    if (expenseIds != null) {
      this.expenseIds = new HashSet<>(expenseIds);
    } else {
      this.expenseIds = Set.of();
    }
  }
}
