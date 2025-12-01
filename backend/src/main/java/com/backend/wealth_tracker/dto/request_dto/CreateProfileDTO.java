package com.backend.wealth_tracker.dto.request_dto;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;

@SuppressWarnings("PMD.DataClass")
public class CreateProfileDTO {
  @NotBlank(message = "Profile name cannot be blank")
  private String profileName;

  private String description;

  @NotBlank(message = "Profile Color code cannot be null")
  private String colorCode;

  private String profilePicture;

  private MultipartFile profilePictureFile;

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

    public MultipartFile getProfilePictureFile() {
        return profilePictureFile;
    }

    public void setProfilePictureFile(MultipartFile profilePictureFile) {
        this.profilePictureFile = profilePictureFile;
    }
}
