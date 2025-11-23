package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.request_dto.CreateProfileDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateProfileDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.mapper.ProfileMapper;
import com.backend.wealth_tracker.model.Profile;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.ProfileRepository;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

  private final Logger LOGGER = LoggerFactory.getLogger(ProfileService.class);

  private final ProfileRepository profileRepository;
  private final AuthService authService;

  public ProfileService(ProfileRepository profileRepository, AuthService authService) {
    this.profileRepository = profileRepository;
    this.authService = authService;
  }

  public Profile saveProfile(CreateProfileDTO createProfileDTO, String userName)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    User user = this.authService.getUserByUsername(userName);
    Profile profile = ProfileMapper.createProfileDTOToProfile(createProfileDTO);
    Optional<Profile> similarCategory =
        this.profileRepository.findByProfileNameAndId(profile.getProfileName(), user.getId());
    if (similarCategory.isPresent()) {
      throw new ResourceAlreadyExistsException(
          "Profile already present with name: "
              + profile.getProfileName()
              + " for user: "
              + user.getId());
    }
    profile.setUser(this.authService.getUserByUsername(userName));
    Profile savedProfile = this.profileRepository.save(profile);
    LOGGER.info("Profile created with id: {}", savedProfile.getId());
    return savedProfile;
  }

  public Profile updateProfile(UpdateProfileDTO updateProfileDTO, String userName)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    User user = this.authService.getUserByUsername(userName);
    Optional<Profile> profileOptional = this.profileRepository.findById(updateProfileDTO.getId());
    if (profileOptional.isEmpty()) {
      throw new ResourceNotFoundException("Profile not found for id: " + updateProfileDTO.getId());
    }
    Profile profile = profileOptional.get();
    if (!profile.getProfileName().equals(updateProfileDTO.getProfileName())) {
      Optional<Profile> similarProfile =
          this.profileRepository.findByProfileNameAndId(
              updateProfileDTO.getProfileName(), user.getId());
      if (similarProfile.isPresent()) {
        throw new ResourceAlreadyExistsException(
            "Profile already present with name: "
                + updateProfileDTO.getProfileName()
                + " for user: "
                + user.getId());
      }
    }
    Profile updatedProfile = updateProfileValues(updateProfileDTO, profile);
    Profile savedProfile = this.profileRepository.save(updatedProfile);
    LOGGER.info("Profile updated with id: {}", savedProfile.getId());
    return savedProfile;
  }

  private Profile updateProfileValues(UpdateProfileDTO updateProfileDTO, Profile profile) {
    if (updateProfileDTO.getProfileName() != null) {
      profile.setProfileName(updateProfileDTO.getProfileName());
    }
    if (updateProfileDTO.getDescription() != null) {
      profile.setDescription(updateProfileDTO.getDescription());
    }
    if (updateProfileDTO.getColorCode() != null) {
      profile.setColorCode(updateProfileDTO.getColorCode());
    }
    if (updateProfileDTO.getProfilePicture() != null) {
      profile.setProfilePicture(updateProfileDTO.getProfilePicture());
    }
    return profile;
  }

  public void deleteProfile(Long id) throws ResourceNotFoundException {
    Optional<Profile> profileOptional = this.profileRepository.findById(id);
    if (profileOptional.isEmpty()) {
      LOGGER.error("Profile to be deleted not found with id: {}", id);
      throw new ResourceNotFoundException("Profile not found");
    }
    Profile profile = profileOptional.get();
    this.profileRepository.delete(profile);
    LOGGER.info("Category deleted with id: {}", id);
  }

  public List<Profile> getAllProfilesForUser(String userName) throws ResourceNotFoundException {
    User user = this.authService.getUserByUsername(userName);
    List<Profile> profiles = this.profileRepository.findAllByUserId(user.getId());
    LOGGER.info("Fetched {} profiles for user: {}", profiles.size(), userName);
    return profiles;
  }
}
