package com.backend.wealth_tracker.controller;

import com.backend.wealth_tracker.dto.request_dto.CreateCategoryDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseCategoryDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateCategoryDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.mapper.CategoryMapper;
import com.backend.wealth_tracker.service.CategoryService;
import jakarta.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

  private final Logger LOGGER = LoggerFactory.getLogger(CategoryController.class);

  private final CategoryService categoryService;

  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @GetMapping("/all")
  @ResponseStatus(HttpStatus.OK)
  public List<ResponseCategoryDTO> getAllCategories(
      @AuthenticationPrincipal UserDetails userDetails) throws ResourceNotFoundException {
    try {
      return CategoryMapper.categoriesToResponseCategoryDTOs(
          this.categoryService.getAllCategories(userDetails.getUsername()));
    } catch (Exception e) {
      LOGGER.error("Failed to get all categories!", e);
      throw e;
    }
  }

  @PostMapping("/save")
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseCategoryDTO saveCategory(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody CreateCategoryDTO createCategoryDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    try {
      return CategoryMapper.categoryToResponseCategoryDTO(
          this.categoryService.saveCategory(createCategoryDTO, userDetails.getUsername()));
    } catch (Exception e) {
      LOGGER.error("Failed to save category!", e);
      throw e;
    }
  }

  @PutMapping("/update")
  @ResponseStatus(HttpStatus.OK)
  public ResponseCategoryDTO updateCategory(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody UpdateCategoryDTO updateCategoryDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    try {
      return CategoryMapper.categoryToResponseCategoryDTO(
          this.categoryService.updateCategory(updateCategoryDTO, userDetails.getUsername()));
    } catch (Exception e) {
      LOGGER.error("Failed to update category!", e);
      throw e;
    }
  }

  @DeleteMapping("/delete/{id}")
  @ResponseStatus(HttpStatus.OK)
  public void deleteCategory(@PathVariable Long id) throws ResourceNotFoundException {
    try {
      this.categoryService.deleteCategory(id);
    } catch (Exception e) {
      LOGGER.error("Failed to delete category!", e);
      throw e;
    }
  }
}
