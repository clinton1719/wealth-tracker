package com.backend.wealth_tracker.profile.service;

import com.backend.wealth_tracker.auth.model.User;
import com.backend.wealth_tracker.auth.service.AuthService;
import com.backend.wealth_tracker.dto.request_dto.CreateProfileDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateProfileDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.helper.Helper;
import com.backend.wealth_tracker.profile.mapper.ProfileMapper;
import com.backend.wealth_tracker.profile.model.Profile;
import com.backend.wealth_tracker.profile.repository.ProfileRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class ProfileService {

  private static final Logger LOGGER = LoggerFactory.getLogger(ProfileService.class);

  private final ProfileRepository profileRepository;
  private final AuthService authService;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public ProfileService(ProfileRepository profileRepository, AuthService authService) {
    this.profileRepository = profileRepository;
    this.authService = authService;
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public Profile saveProfile(CreateProfileDTO createProfileDTO, String userName)
      throws ResourceNotFoundException, ResourceAlreadyExistsException, IOException {
    User user = authService.getUserByUsername(userName);
    Profile profile = ProfileMapper.createProfileDTOToProfile(createProfileDTO);
    Optional<Profile> similarCategory =
        profileRepository.findByProfileNameAndUserId(profile.getProfileName(), user.getId());
    if (similarCategory.isPresent()) {
      throw new ResourceAlreadyExistsException(
          "Profile already present with name: "
              + profile.getProfileName()
              + " for user: "
              + user.getId());
    }
    profile.setUser(authService.getUserByUsername(userName));
    Profile savedProfile = profileRepository.save(profile);
    LOGGER.atInfo().log("Profile created : {}", savedProfile);
    return savedProfile;
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public Profile updateProfile(UpdateProfileDTO updateProfileDTO, String userName)
      throws ResourceNotFoundException, ResourceAlreadyExistsException, IOException {
    User user = authService.getUserByUsername(userName);
    Optional<Profile> profileOptional =
        profileRepository.findByProfileIdAndUserId(updateProfileDTO.getProfileId(), user.getId());
    if (profileOptional.isEmpty()) {
      throw new ResourceNotFoundException("Profile not found for: " + updateProfileDTO);
    }
    Profile profile = profileOptional.get();
    if (!profile.getProfileName().equals(updateProfileDTO.getProfileName())) {
      Optional<Profile> similarProfile =
          profileRepository.findByProfileNameAndUserId(
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
    Profile savedProfile = profileRepository.save(updatedProfile);
    LOGGER.atInfo().log("Profile updated : {}", savedProfile);
    return savedProfile;
  }

  private Profile updateProfileValues(UpdateProfileDTO updateProfileDTO, Profile profile)
      throws IOException {
    if (updateProfileDTO.getProfileName() != null) {
      profile.setProfileName(updateProfileDTO.getProfileName());
    }
    if (updateProfileDTO.getProfileDescription() != null) {
      profile.setProfileDescription(updateProfileDTO.getProfileDescription());
    }
    if (updateProfileDTO.getProfileColorCode() != null) {
      profile.setProfileColorCode(updateProfileDTO.getProfileColorCode());
    }
    if (updateProfileDTO.isProfilePicturePresent()) {
      MultipartFile file = updateProfileDTO.getProfilePictureFile();
      String extension = Helper.getExtension(file);
      profile.setProfilePictureExtension(extension);
      profile.setProfilePicture(file.getBytes());
    }

    return profile;
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public void deleteProfile(Long id, String userName) throws ResourceNotFoundException {
    User user = authService.getUserByUsername(userName);
    Optional<Profile> profileOptional =
        profileRepository.findByProfileIdAndUserId(id, user.getId());
    if (profileOptional.isEmpty()) {
      LOGGER.atError().log("Profile to be deleted not found with id: {}", id);
      throw new ResourceNotFoundException("Profile not found");
    }
    Profile profile = profileOptional.get();
    profileRepository.delete(profile);
    LOGGER.atInfo().log("Category deleted with id: {}", id);
  }

  @Transactional(
      isolation = Isolation.READ_COMMITTED,
      propagation = Propagation.REQUIRED,
      readOnly = true)
  public List<Profile> getAllProfilesForUser(String userName) throws ResourceNotFoundException {
    User user = authService.getUserByUsername(userName);
    List<Profile> profiles = profileRepository.findAllWithRelations(user.getId());
    LOGGER.atInfo().log("Fetched {} profiles for user: {}", profiles.size(), userName);
    return profiles;
  }
}
