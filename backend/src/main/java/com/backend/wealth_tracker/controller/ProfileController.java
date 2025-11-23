package com.backend.wealth_tracker.controller;

import com.backend.wealth_tracker.dto.request_dto.CreateProfileDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseProfileDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateProfileDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.mapper.ProfileMapper;
import com.backend.wealth_tracker.service.ProfileService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/profiles")
public class ProfileController {

  private final ProfileService profileService;

  public ProfileController(ProfileService profileService) {
    this.profileService = profileService;
  }

  @GetMapping(value = "/all")
  @ResponseStatus(HttpStatus.OK)
  public List<ResponseProfileDTO> getAllProfilesForUser(
      @AuthenticationPrincipal UserDetails userDetails) throws ResourceNotFoundException {
    return ProfileMapper.profilesToResponseProfileDTOs(
        this.profileService.getAllProfilesForUser(userDetails.getUsername()));
  }

  @PostMapping("/save")
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseProfileDTO saveProfile(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody CreateProfileDTO createProfileDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    return ProfileMapper.profileToResponseProfileDTO(
        this.profileService.saveProfile(createProfileDTO, userDetails.getUsername()));
  }

  @PutMapping("/update")
  @ResponseStatus(HttpStatus.OK)
  public ResponseProfileDTO updateCategory(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody UpdateProfileDTO updateProfileDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    return ProfileMapper.profileToResponseProfileDTO(
        this.profileService.updateProfile(updateProfileDTO, userDetails.getUsername()));
  }

  @DeleteMapping("/delete/{id}")
  @ResponseStatus(HttpStatus.OK)
  public void deleteCategory(@PathVariable Long id) throws ResourceNotFoundException {
    this.profileService.deleteProfile(id);
  }
}
