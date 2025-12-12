package com.backend.wealth_tracker.dto.request_dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.validator.constraints.Length;

@SuppressWarnings("PMD.DataClass")
public class CreateCategoryDTO {
  @NotBlank(message = "Category name cannot be blank")
  private String categoryName;

  private String categoryDescription;

  @NotBlank(message = "Category color code cannot be blank")
  @Length(
      min = 4,
      max = 7,
      message = "Color code must be between 4 and 7 characters long, inclusive.")
  private String categoryColorCode;

  private String categoryIcon;
  private List<String> categoryTags;

  @NotNull(message = "Profile id cannot be null")
  private Long profileId;

  public String getCategoryName() {
    return categoryName;
  }

  public void setCategoryName(String categoryName) {
    this.categoryName = categoryName;
  }

  public String getCategoryDescription() {
    return categoryDescription;
  }

  public void setCategoryDescription(String categoryDescription) {
    this.categoryDescription = categoryDescription;
  }

  public String getCategoryColorCode() {
    return categoryColorCode;
  }

  public void setCategoryColorCode(String categoryColorCode) {
    this.categoryColorCode = categoryColorCode;
  }

  public String getCategoryIcon() {
    return categoryIcon;
  }

  public void setCategoryIcon(String categoryIcon) {
    this.categoryIcon = categoryIcon;
  }

  public List<String> getCategoryTags() {
    return List.copyOf(categoryTags);
  }

  public void setCategoryTags(List<String> categoryTags) {
    if (categoryTags != null) {
      this.categoryTags = new ArrayList<>(categoryTags);
    } else {
      this.categoryTags = List.of();
    }
  }

  public Long getProfileId() {
    return profileId;
  }

  public void setProfileId(Long profileId) {
    this.profileId = profileId;
  }
}
