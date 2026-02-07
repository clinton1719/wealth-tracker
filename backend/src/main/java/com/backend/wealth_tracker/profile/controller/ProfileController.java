package com.backend.wealth_tracker.profile.controller;

import com.backend.wealth_tracker.dto.request_dto.CreateProfileDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseProfileDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateProfileDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.profile.mapper.ProfileMapper;
import com.backend.wealth_tracker.profile.service.ProfileService;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

import static com.backend.wealth_tracker.helper.Constants.*;

@RestController
@RequestMapping(value = "/api/v1/profiles")
@Tag(name = "Profile", description = "API methods to manipulate Profile data")
public class ProfileController {

  private final ProfileService profileService;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public ProfileController(ProfileService profileService) {
    this.profileService = profileService;
  }

  @GetMapping(value = "/all")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = READ_CALL_TAG)
  public List<ResponseProfileDTO> getAllProfilesForUser(
      @AuthenticationPrincipal UserDetails userDetails) throws ResourceNotFoundException {
    return ProfileMapper.profilesToResponseProfileDTOs(
        this.profileService.getAllProfilesForUser(userDetails.getUsername()));
  }

  @PostMapping(value = "/save", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @ResponseStatus(HttpStatus.CREATED)
  @Tag(name = CREATE_CALL_TAG)
  public ResponseProfileDTO saveProfile(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @ModelAttribute CreateProfileDTO createProfileDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException, IOException {
    return ProfileMapper.profileToResponseProfileDTO(
        this.profileService.saveProfile(createProfileDTO, userDetails.getUsername()));
  }

  @PutMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = UPDATE_CALL_TAG)
  public ResponseProfileDTO updateCategory(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @ModelAttribute UpdateProfileDTO updateProfileDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException, IOException {
    return ProfileMapper.profileToResponseProfileDTO(
        this.profileService.updateProfile(updateProfileDTO, userDetails.getUsername()));
  }

  @DeleteMapping("/delete/{id}")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = DELETE_CALL_TAG)
  public void deleteCategory(
      @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id)
      throws ResourceNotFoundException {
    this.profileService.deleteProfile(id, userDetails.getUsername());
  }
}
