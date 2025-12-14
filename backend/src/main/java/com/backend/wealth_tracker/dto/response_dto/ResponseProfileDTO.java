package com.backend.wealth_tracker.dto.response_dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@SuppressWarnings("PMD.DataClass")
public class ResponseProfileDTO {
  @NotNull private Long profileId;
  @NotBlank private String profileName;
  private String profileDescription;
  @NotBlank
  private String profileColorCode;
  private String profilePicture;

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
}
