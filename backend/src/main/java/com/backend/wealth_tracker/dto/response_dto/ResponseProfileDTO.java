package com.backend.wealth_tracker.dto.response_dto;

import java.util.Set;

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
    return accountIds;
  }

  public void setAccountIds(Set<Long> accountIds) {
    this.accountIds = accountIds;
  }

  public Set<Long> getCategoryIds() {
    return categoryIds;
  }

  public void setCategoryIds(Set<Long> categoryIds) {
    this.categoryIds = categoryIds;
  }

  public Set<Long> getExpenseIds() {
    return expenseIds;
  }

  public void setExpenseIds(Set<Long> expenseIds) {
    this.expenseIds = expenseIds;
  }
}
