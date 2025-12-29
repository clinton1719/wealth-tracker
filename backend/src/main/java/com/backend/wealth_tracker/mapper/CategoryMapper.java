package com.backend.wealth_tracker.mapper;

import com.backend.wealth_tracker.dto.request_dto.CreateCategoryDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseCategoryDTO;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.Profile;
import com.backend.wealth_tracker.model.User;
import java.util.Comparator;
import java.util.List;

public final class CategoryMapper {

  private CategoryMapper() {}
  ;

  public static Category createCategoryDTOtoCategory(
      CreateCategoryDTO createCategoryDTO, User user, Profile profile) {
    Category category = new Category();
    category.setCategoryName(createCategoryDTO.getCategoryName());
    category.setCategoryDescription(createCategoryDTO.getCategoryDescription());
    category.setCategoryColorCode(createCategoryDTO.getCategoryColorCode());
    category.setCategoryIcon(createCategoryDTO.getCategoryIcon());
    category.setCategoryTags(createCategoryDTO.getCategoryTags());
    category.setUser(user);
    category.setProfile(profile);
    return category;
  }

  public static ResponseCategoryDTO categoryToResponseCategoryDTO(Category category) {
    ResponseCategoryDTO responseCategoryDTO = new ResponseCategoryDTO();
    responseCategoryDTO.setCategoryId(category.getCategoryId());
    responseCategoryDTO.setCategoryName(category.getCategoryName());
    responseCategoryDTO.setCategoryDescription(category.getCategoryDescription());
    responseCategoryDTO.setCategoryColorCode(category.getCategoryColorCode());
    responseCategoryDTO.setCategoryIcon(category.getCategoryIcon());
    responseCategoryDTO.setCategoryTags(category.getCategoryTags());
    responseCategoryDTO.setProfileId(category.getProfile().getProfileId());
    return responseCategoryDTO;
  }

  public static List<ResponseCategoryDTO> categoriesToResponseCategoryDTOs(
      List<Category> categories) {
    return categories.parallelStream()
        .map(CategoryMapper::categoryToResponseCategoryDTO)
        .sorted(Comparator.comparing(ResponseCategoryDTO::getCategoryName))
        .toList();
  }
}
