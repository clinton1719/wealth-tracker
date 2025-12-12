package com.backend.wealth_tracker.dto.update_dto;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

@SuppressWarnings("PMD.DataClass")
public class UpdateProfileDTO {
  @NotNull(message = "Profile ID cannot be null")
  private Long profileId;

  private String profileName;
  private String profileDescription;
  private String profileColorCode;
  private String profilePicture;
  private MultipartFile profilePictureFile;

  public boolean isProfilePicturePresent() {
    return this.getProfilePictureFile() != null && !this.getProfilePictureFile().isEmpty();
  }

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

  public MultipartFile getProfilePictureFile() {
    return profilePictureFile;
  }

  public void setProfilePictureFile(MultipartFile profilePictureFile) {
    this.profilePictureFile = profilePictureFile;
  }
}
