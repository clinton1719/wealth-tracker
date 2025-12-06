package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.request_dto.CreateCategoryDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateCategoryDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.exception.UnAuthorizedException;
import com.backend.wealth_tracker.helper.Helper;
import com.backend.wealth_tracker.mapper.CategoryMapper;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.CategoryRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {
  private static final Logger LOGGER = LoggerFactory.getLogger(CategoryService.class);
  private final CategoryRepository categoryRepository;
  private final AuthService authService;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public CategoryService(
      CategoryRepository categoryRepository,
      AuthService authService,
      ExpenseService expenseService) {
    this.categoryRepository = categoryRepository;
    this.authService = authService;
  }

  @Transactional(
      isolation = Isolation.READ_UNCOMMITTED,
      propagation = Propagation.REQUIRED,
      readOnly = true)
  public List<Category> getAllCategories(String userName) throws ResourceNotFoundException {
    User user = this.authService.getUserByUsername(userName);
    List<Category> categories = this.categoryRepository.findAllWithRelations(user.getId());
    LOGGER.atInfo().log("Fetched {} categories for user: {}", categories.size(), userName);
    return categories;
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public Category saveCategory(CreateCategoryDTO createCategoryDTO, String userName)
      throws ResourceNotFoundException, ResourceAlreadyExistsException, UnAuthorizedException {
    User user = this.authService.getUserByUsername(userName);
    if (!Helper.isProfileIdValid(user.getProfiles(), createCategoryDTO.getProfileId())) {
      LOGGER
          .atError()
          .log("Category to be saved had illegal profile ID: {}", createCategoryDTO.getProfileId());
      throw new UnAuthorizedException("Illegal profile id in category");
    }
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
    LOGGER.atInfo().log("Category to be saved created : {}", savedCategory);
    return savedCategory;
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public Category updateCategory(UpdateCategoryDTO updateCategoryDTO, String userName)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    User user = this.authService.getUserByUsername(userName);
    Optional<Category> categoryOptional =
        this.categoryRepository.findByIdAndUserId(updateCategoryDTO.getId(), user.getId());
    if (categoryOptional.isEmpty()) {
      LOGGER.atError().log("Category to be updated not found : {}", updateCategoryDTO);
      throw new ResourceNotFoundException("Category not found");
    }
    if (!categoryOptional.get().getCategoryName().equals(updateCategoryDTO.getCategoryName())) {
      Optional<Category> similarCategory =
          this.categoryRepository.findByCategoryNameAndUserId(
              updateCategoryDTO.getCategoryName(), user.getId());
      if (similarCategory.isPresent()) {
        throw new ResourceAlreadyExistsException(
            "Category already present with name: "
                + updateCategoryDTO.getCategoryName()
                + " for user: "
                + user.getId());
      }
    }
    Category category = updateCategoryValues(updateCategoryDTO, categoryOptional.get());
    Category updatedCategory = this.categoryRepository.save(category);
    LOGGER.atInfo().log("Category updated : {}", updatedCategory);
    return updatedCategory;
  }

  private Category updateCategoryValues(UpdateCategoryDTO updateCategoryDTO, Category category) {
    if (updateCategoryDTO.getCategoryName() != null) {
      category.setCategoryName(updateCategoryDTO.getCategoryName());
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
    return category;
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public void deleteCategory(Long id, String userName) throws ResourceNotFoundException {
    User user = this.authService.getUserByUsername(userName);
    Optional<Category> categoryOptional =
        this.categoryRepository.findByIdAndUserId(id, user.getId());
    if (categoryOptional.isEmpty()) {
      LOGGER.atError().log("Category to be deleted not found with id: {}", id);
      throw new ResourceNotFoundException("Category not found");
    }
    Category category = categoryOptional.get();
    this.categoryRepository.delete(category);
    LOGGER.atInfo().log("Category deleted with id: {}", id);
  }
}
