package com.backend.wealth_tracker.dto.request_dto;

import jakarta.validation.constraints.NotBlank;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;


public class CreateProfileDTO {
  @NotBlank(message = "Profile name cannot be blank")
  private String profileName;

  private String profileDescription;

  @NotBlank(message = "Category color code cannot be blank")
  @Length(
      min = 4,
      max = 7,
      message = "Color code must be between 4 and 7 characters long, inclusive.")
  private String profileColorCode;

  private String profilePicture;

  private MultipartFile profilePictureFile;

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
