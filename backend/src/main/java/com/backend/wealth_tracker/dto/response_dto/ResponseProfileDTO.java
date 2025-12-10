package com.backend.wealth_tracker.dto.response_dto;

import java.util.HashSet;
import java.util.Set;

@SuppressWarnings("PMD.DataClass")
public class ResponseProfileDTO {
  private Long profileId;
  private String profileName;
  private String profileDescription;
  private String profileColorCode;
  private String profilePicture;
  private Set<Long> accountIds;
  private Set<Long> categoryIds;
  private Set<Long> expenseIds;

  public Long getProfileId() {
    return profileId;
  }

  public void setProfileId(Long profileId) {
    this.profileId = profileId;
  }

  public String getProfileName() {
    return profileName;
  }

  public void setProfileName(String profileName) {
    this.profileName = profileName;
  }

  public String getProfileDescription() {
    return profileDescription;
  }

  public void setProfileDescription(String profileDescription) {
    this.profileDescription = profileDescription;
  }

  public String getProfileColorCode() {
    return profileColorCode;
  }

  public void setProfileColorCode(String profileColorCode) {
    this.profileColorCode = profileColorCode;
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
