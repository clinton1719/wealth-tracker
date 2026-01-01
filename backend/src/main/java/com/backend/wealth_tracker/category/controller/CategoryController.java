package com.backend.wealth_tracker.category.controller;

import com.backend.wealth_tracker.dto.request_dto.CreateCategoryDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseCategoryDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateCategoryDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.exception.UnAuthorizedException;
import com.backend.wealth_tracker.category.mapper.CategoryMapper;
import com.backend.wealth_tracker.category.service.CategoryService;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.backend.wealth_tracker.helper.Constants.*;

@RestController
@RequestMapping("/api/v1/categories")
@Tag(name = "Category", description = "API methods to manipulate Category data")
public class CategoryController {

  private final CategoryService categoryService;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public CategoryController(CategoryService categoryService) {
    this.categoryService = categoryService;
  }

  @GetMapping("/all")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = READ_CALL_TAG)
  public List<ResponseCategoryDTO> getAllCategories(
      @AuthenticationPrincipal UserDetails userDetails) throws ResourceNotFoundException {
    return CategoryMapper.categoriesToResponseCategoryDTOs(
        this.categoryService.getAllCategories(userDetails.getUsername()));
  }

  @PostMapping("/save")
  @Tag(name = CREATE_CALL_TAG)
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseCategoryDTO saveCategory(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody CreateCategoryDTO createCategoryDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException, UnAuthorizedException {
    return CategoryMapper.categoryToResponseCategoryDTO(
        this.categoryService.saveCategory(createCategoryDTO, userDetails.getUsername()));
  }

  @PutMapping("/update")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = UPDATE_CALL_TAG)
  public ResponseCategoryDTO updateCategory(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody UpdateCategoryDTO updateCategoryDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    return CategoryMapper.categoryToResponseCategoryDTO(
        this.categoryService.updateCategory(updateCategoryDTO, userDetails.getUsername()));
  }

  @DeleteMapping("/delete/{id}")
  @Tag(name = DELETE_CALL_TAG)
  @ResponseStatus(HttpStatus.OK)
  public void deleteCategory(
      @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id)
      throws ResourceNotFoundException {
    this.categoryService.deleteCategory(id, userDetails.getUsername());
  }
}
