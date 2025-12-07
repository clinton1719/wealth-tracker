package com.backend.wealth_tracker.dto.update_dto;

import jakarta.validation.constraints.NotNull;
import org.springframework.web.multipart.MultipartFile;

@SuppressWarnings("PMD.DataClass")
public class UpdateProfileDTO {
  @NotNull(message = "Profile ID cannot be null")
  private Long id;

  private String profileName;
  private String description;
  private String colorCode;
  private String profilePicture;
  private MultipartFile profilePictureFile;

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

  public MultipartFile getProfilePictureFile() {
    return profilePictureFile;
  }

  public void setProfilePictureFile(MultipartFile profilePictureFile) {
    this.profilePictureFile = profilePictureFile;
  }
}
