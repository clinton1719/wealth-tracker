package com.backend.wealth_tracker.dto.request_dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.validator.constraints.Length;

@SuppressWarnings("PMD.DataClass")
public class CreateCategoryDTO {
  @NotBlank(message = "Category name cannot be blank")
  private String name;

  private String description;

  @NotBlank(message = "Category color code cannot be blank")
  @Length(
      min = 4,
      max = 7,
      message = "Color code must be between 4 and 7 characters long, inclusive.")
  private String colorCode;

  private String icon;
  private List<String> tags;

  @NotNull(message = "Profile id cannot be null")
  private Long profileId;

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
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

  public String getIcon() {
    return icon;
  }

  public void setIcon(String icon) {
    this.icon = icon;
  }

  public List<String> getTags() {
    return List.copyOf(tags);
  }

  public void setTags(List<String> tags) {
    if (tags != null) {
      this.tags = new ArrayList<>(tags);
    } else {
      this.tags = List.of();
    }
  }

  public Long getProfileId() {
    return profileId;
  }

  public void setProfileId(Long profileId) {
    this.profileId = profileId;
  }
}
