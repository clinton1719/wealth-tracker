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
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {

  private final CategoryService categoryService;

  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @GetMapping("/all")
  @ResponseStatus(HttpStatus.OK)
  public List<ResponseCategoryDTO> getAllCategories(
      @AuthenticationPrincipal UserDetails userDetails) throws ResourceNotFoundException {
    return CategoryMapper.categoriesToResponseCategoryDTOs(
        this.categoryService.getAllCategories(userDetails.getUsername()));
  }

  @PostMapping("/save")
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseCategoryDTO saveCategory(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody CreateCategoryDTO createCategoryDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    return CategoryMapper.categoryToResponseCategoryDTO(
        this.categoryService.saveCategory(createCategoryDTO, userDetails.getUsername()));
  }

  @PutMapping("/update")
  @ResponseStatus(HttpStatus.OK)
  public ResponseCategoryDTO updateCategory(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody UpdateCategoryDTO updateCategoryDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    return CategoryMapper.categoryToResponseCategoryDTO(
        this.categoryService.updateCategory(updateCategoryDTO, userDetails.getUsername()));
  }

  @DeleteMapping("/delete/{id}")
  @ResponseStatus(HttpStatus.OK)
  public void deleteCategory(@PathVariable Long id) throws ResourceNotFoundException {
    this.categoryService.deleteCategory(id);
  }
}
