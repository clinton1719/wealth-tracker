package com.backend.wealth_tracker.dto.update_dto;

import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("PMD.DataClass")
public class UpdateCategoryDTO {
  @NotNull(message = "Category ID cannot be null")
  private Long id;

  private String categoryName;
  private String description;
  private String colorCode;
  private String icon;
  private List<String> tags;

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public void setCategoryName(String categoryName) {
    this.categoryName = categoryName;
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
}
