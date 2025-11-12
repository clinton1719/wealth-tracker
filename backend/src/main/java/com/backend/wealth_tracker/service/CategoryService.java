package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.CreateCategoryDTO;
import com.backend.wealth_tracker.dto.UpdateCategoryDTO;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.mapper.CategoryMapper;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {
    private final Logger LOGGER = LoggerFactory.getLogger(CategoryService.class);

    private final CategoryRepository categoryRepository;

    private final AuthService authService;

    public CategoryService(CategoryRepository categoryRepository, AuthService authService) {
        this.categoryRepository = categoryRepository;
        this.authService = authService;
    }

    public List<Category> getAllCategories(String userName) throws ResourceNotFoundException {
        User user = this.authService.getUserByUsername(userName);
        List<Category> categories = this.categoryRepository.findAllCategoriesByUserId(user.getId());
        LOGGER.info("Fetched {} categories for user: {}", categories.size(), userName);
        return categories;
    }

    public Category saveCategory(CreateCategoryDTO createCategoryDTO, String userName) throws ResourceNotFoundException {
        User user = this.authService.getUserByUsername(userName);
        Category category = CategoryMapper.createCategoryDTOtoCategory(createCategoryDTO, user);
        Category savedCategory = this.categoryRepository.save(category);
        LOGGER.info("Category to be saved created with id: {}", savedCategory.getId());
        return savedCategory;
    }

    public Category updateCategory(UpdateCategoryDTO updateCategoryDTO) throws ResourceNotFoundException {
        Optional<Category> categoryOptional = this.categoryRepository.findById(updateCategoryDTO.getId());
        if (categoryOptional.isEmpty()) {
            LOGGER.error("Category to be updated not found with id: {}", updateCategoryDTO.getId());
            throw new ResourceNotFoundException("Category not found");
        }
        Category category = updateCategoryValues(updateCategoryDTO, categoryOptional.get());
        Category updatedCategory = this.categoryRepository.save(category);
        LOGGER.info("Category updated with id: {}", updatedCategory.getId());
        return updatedCategory;
    }

    private Category updateCategoryValues(UpdateCategoryDTO updateCategoryDTO, Category category) {
        if (updateCategoryDTO.getName() != null) {
            category.setName(updateCategoryDTO.getName());
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

    public void deleteCategory(Long id) throws ResourceNotFoundException {
        Optional<Category> categoryOptional = this.categoryRepository.findById(id);
        if (categoryOptional.isEmpty()) {
            LOGGER.error("Category to be deleted not found with id: {}", id);
            throw new ResourceNotFoundException("Category not found");
        }
        this.categoryRepository.delete(categoryOptional.get());
        LOGGER.info("Category deleted with id: {}", id);
    }
}
