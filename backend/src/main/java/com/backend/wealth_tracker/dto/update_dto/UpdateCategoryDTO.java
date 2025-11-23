package com.backend.wealth_tracker.dto.update_dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

@SuppressWarnings("PMD.DataClass")
public class UpdateCategoryDTO {
  @NotNull(message = "Category ID cannot be null")
  private Long id;

  private String name;
  private String description;
  private String colorCode;
  private String icon;
  private List<String> tags;
  private Long profileId;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

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
    return tags;
  }

  public void setTags(List<String> tags) {
    this.tags = tags;
  }

  public Long getProfileId() {
    return profileId;
  }

  public void setProfileId(Long profileId) {
    this.profileId = profileId;
  }
}
