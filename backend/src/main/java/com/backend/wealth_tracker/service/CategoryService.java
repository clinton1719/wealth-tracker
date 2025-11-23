package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.request_dto.CreateCategoryDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateCategoryDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.mapper.CategoryMapper;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.Profile;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.CategoryRepository;
import com.backend.wealth_tracker.repository.ProfileRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class CategoryService {
  private final Logger LOGGER = LoggerFactory.getLogger(CategoryService.class);
  private final CategoryRepository categoryRepository;
  private final AuthService authService;
  private final ProfileRepository profileRepository;

  public CategoryService(
      CategoryRepository categoryRepository,
      AuthService authService,
      ExpenseService expenseService,
      ProfileRepository profileRepository) {
    this.categoryRepository = categoryRepository;
    this.authService = authService;
    this.profileRepository = profileRepository;
  }

  public List<Category> getAllCategories(String userName) throws ResourceNotFoundException {
    User user = this.authService.getUserByUsername(userName);
    List<Category> categories = this.categoryRepository.findAllCategoriesByUserId(user.getId());
    LOGGER.info("Fetched {} categories for user: {}", categories.size(), userName);
    return categories;
  }

  public Category saveCategory(CreateCategoryDTO createCategoryDTO, String userName)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    User user = this.authService.getUserByUsername(userName);
    Category category = CategoryMapper.createCategoryDTOtoCategory(createCategoryDTO, user);
    Optional<Category> similarCategory =
        this.categoryRepository.findByCategoryNameAndUserId(
            category.getCategoryName(), user.getId());
    if (similarCategory.isPresent()) {
      throw new ResourceAlreadyExistsException(
          "Category already present with name: "
              + category.getCategoryName()
              + " for user: "
              + user.getId());
    }
    Category savedCategory = this.categoryRepository.save(category);
    LOGGER.info("Category to be saved created with id: {}", savedCategory.getId());
    return savedCategory;
  }

  public Category updateCategory(UpdateCategoryDTO updateCategoryDTO, String userName)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    User user = this.authService.getUserByUsername(userName);
    Optional<Category> categoryOptional =
        this.categoryRepository.findById(updateCategoryDTO.getId());
    if (categoryOptional.isEmpty()) {
      LOGGER.error("Category to be updated not found with id: {}", updateCategoryDTO.getId());
      throw new ResourceNotFoundException("Category not found");
    }
    if (!categoryOptional.get().getCategoryName().equals(updateCategoryDTO.getName())) {
      Optional<Category> similarCategory =
          this.categoryRepository.findByCategoryNameAndUserId(
              updateCategoryDTO.getName(), user.getId());
      if (similarCategory.isPresent()) {
        throw new ResourceAlreadyExistsException(
            "Category already present with name: "
                + updateCategoryDTO.getName()
                + " for user: "
                + user.getId());
      }
    }
    Category category = updateCategoryValues(updateCategoryDTO, categoryOptional.get());
    Category updatedCategory = this.categoryRepository.save(category);
    LOGGER.info("Category updated with id: {}", updatedCategory.getId());
    return updatedCategory;
  }

  private Category updateCategoryValues(UpdateCategoryDTO updateCategoryDTO, Category category)
      throws ResourceNotFoundException {
    if (updateCategoryDTO.getName() != null) {
      category.setCategoryName(updateCategoryDTO.getName());
    }
    if (updateCategoryDTO.getDescription() != null) {
      category.setDescription(updateCategoryDTO.getDescription());
    }
    if (updateCategoryDTO.getColorCode() != null) {
      category.setColorCode(updateCategoryDTO.getColorCode());
    }
    if (updateCategoryDTO.getIcon() != null) {
      category.setIcon(updateCategoryDTO.getIcon());
    }
    if (updateCategoryDTO.getTags() != null) {
      category.setTags(updateCategoryDTO.getTags());
    }
    if (updateCategoryDTO.getProfileId() != null) {
      Optional<Profile> optionalProfile =
          this.profileRepository.findById(updateCategoryDTO.getProfileId());
      if (optionalProfile.isEmpty()) {
        throw new ResourceNotFoundException(
            "Profile not found for ID: " + updateCategoryDTO.getProfileId());
      }
      category.setProfile(optionalProfile.get());
    }
    return category;
  }

  public void deleteCategory(Long id) throws ResourceNotFoundException {
    Optional<Category> categoryOptional = this.categoryRepository.findById(id);
    if (categoryOptional.isEmpty()) {
      LOGGER.error("Category to be deleted not found with id: {}", id);
      throw new ResourceNotFoundException("Category not found");
    }
    Category category = categoryOptional.get();
    this.categoryRepository.delete(category);
    LOGGER.info("Category deleted with id: {}", id);
  }
}
