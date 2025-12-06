package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.request_dto.CreateProfileDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateProfileDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.helper.Helper;
import com.backend.wealth_tracker.mapper.ProfileMapper;
import com.backend.wealth_tracker.model.Profile;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.ProfileRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
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
        User user = this.authService.getUserByUsername(userName);
        Profile profile = ProfileMapper.createProfileDTOToProfile(createProfileDTO);
        Optional<Profile> similarCategory =
                this.profileRepository.findByProfileNameAndUserId(profile.getProfileName(), user.getId());
        if (similarCategory.isPresent()) {
            throw new ResourceAlreadyExistsException(
                    "Profile already present with name: "
                            + profile.getProfileName()
                            + " for user: "
                            + user.getId());
        }
        profile.setUser(this.authService.getUserByUsername(userName));
        Profile savedProfile = this.profileRepository.save(profile);
        LOGGER.atInfo().log("Profile created : {}", savedProfile);
        return savedProfile;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
    public Profile updateProfile(UpdateProfileDTO updateProfileDTO, String userName)
            throws ResourceNotFoundException, ResourceAlreadyExistsException, IOException {
        User user = this.authService.getUserByUsername(userName);
        Optional<Profile> profileOptional = this.profileRepository.findByIdAndUserId(updateProfileDTO.getId(), user.getId());
        if (profileOptional.isEmpty()) {
            throw new ResourceNotFoundException("Profile not found for: " + updateProfileDTO);
        }
        Profile profile = profileOptional.get();
        if (!profile.getProfileName().equals(updateProfileDTO.getProfileName())) {
            Optional<Profile> similarProfile =
                    this.profileRepository.findByProfileNameAndUserId(
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
        LOGGER.atInfo().log("Profile updated : {}", savedProfile);
        return savedProfile;
    }

    private Profile updateProfileValues(UpdateProfileDTO updateProfileDTO, Profile profile)
            throws IOException {
        if (updateProfileDTO.getProfileName() != null) {
            profile.setProfileName(updateProfileDTO.getProfileName());
        }
        if (updateProfileDTO.getDescription() != null) {
            profile.setDescription(updateProfileDTO.getDescription());
        }
        if (updateProfileDTO.getColorCode() != null) {
            profile.setColorCode(updateProfileDTO.getColorCode());
        }
        if (updateProfileDTO.getProfilePictureFile() != null
                && !updateProfileDTO.getProfilePictureFile().isEmpty()) {
            String extension = Helper.getExtension(updateProfileDTO.getProfilePictureFile());
            profile.setProfilePictureExtension(extension);
            profile.setProfilePicture(updateProfileDTO.getProfilePictureFile().getBytes());
        }

        return profile;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
    public void deleteProfile(Long id, String userName) throws ResourceNotFoundException {
        User user = this.authService.getUserByUsername(userName);
        Optional<Profile> profileOptional = this.profileRepository.findByIdAndUserId(id, user.getId());
        if (profileOptional.isEmpty()) {
            LOGGER.atError().log("Profile to be deleted not found with id: {}", id);
            throw new ResourceNotFoundException("Profile not found");
        }
        Profile profile = profileOptional.get();
        this.profileRepository.delete(profile);
        LOGGER.atInfo().log("Category deleted with id: {}", id);
    }

    @Transactional(isolation = Isolation.READ_COMMITTED, propagation = Propagation.REQUIRED, readOnly = true)
    public List<Profile> getAllProfilesForUser(String userName) throws ResourceNotFoundException {
        User user = this.authService.getUserByUsername(userName);
        List<Profile> profiles = this.profileRepository.findAllWithRelations(user.getId());
        LOGGER.atInfo().log("Fetched {} profiles for user: {}", profiles.size(), userName);
        return profiles;
    }
}
