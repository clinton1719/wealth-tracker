package com.backend.wealth_tracker.mapper;

import com.backend.wealth_tracker.dto.CreateCategoryDTO;
import com.backend.wealth_tracker.dto.ResponseCategoryDTO;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.User;

import java.util.List;

public class CategoryMapper {

    public static Category createCategoryDTOtoCategory(CreateCategoryDTO createCategoryDTO, User user) {
        Category category = new Category();
        category.setName(createCategoryDTO.getName());
        category.setDescription(createCategoryDTO.getDescription());
        category.setColorCode(createCategoryDTO.getColorCode());
        category.setIcon(createCategoryDTO.getIcon());
        category.setTags(createCategoryDTO.getTags());
        category.setUser(user);
        return category;
    }

    public static ResponseCategoryDTO categoryToResponseCategoryDTO(Category category) {
        ResponseCategoryDTO responseCategoryDTO = new ResponseCategoryDTO();
        responseCategoryDTO.setId(category.getId());
        responseCategoryDTO.setName(category.getName());
        responseCategoryDTO.setDescription(category.getDescription());
        responseCategoryDTO.setColorCode(category.getColorCode());
        responseCategoryDTO.setIcon(category.getIcon());
        responseCategoryDTO.setTags(category.getTags());
        return responseCategoryDTO;
    }

    public static List<ResponseCategoryDTO> categoriesToResponseCategoryDTOs(List<Category> categories) {
        return categories.parallelStream()
                .map(CategoryMapper::categoryToResponseCategoryDTO)
                .toList();
    }
}
