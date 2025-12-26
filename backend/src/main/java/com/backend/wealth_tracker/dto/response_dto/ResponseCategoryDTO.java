package com.backend.wealth_tracker.dto.response_dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;


public class ResponseCategoryDTO {
  @NotNull private Long categoryId;
  @NotBlank private String categoryName;
  private String categoryDescription;
  @NotNull private String categoryColorCode;
  private String categoryIcon;
  private List<String> categoryTags;
  @NotNull private Long profileId;

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

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
