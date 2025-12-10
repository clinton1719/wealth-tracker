package com.backend.wealth_tracker.mapper;

import com.backend.wealth_tracker.dto.request_dto.CreateProfileDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseProfileDTO;
import com.backend.wealth_tracker.helper.Helper;
import com.backend.wealth_tracker.model.Account;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.Expense;
import com.backend.wealth_tracker.model.Profile;
import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.web.multipart.MultipartFile;

public final class ProfileMapper {
  private ProfileMapper() {}

  public static Profile createProfileDTOToProfile(CreateProfileDTO createProfileDTO)
      throws IOException {
    Profile profile = new Profile();
    profile.setProfileName(createProfileDTO.getProfileName());
    profile.setProfileDescription(createProfileDTO.getProfileDescription());
    profile.setProfileColorCode(createProfileDTO.getProfileColorCode());
    MultipartFile multipartFile = createProfileDTO.getProfilePictureFile();
    if (multipartFile != null) {
      profile.setProfilePicture(multipartFile.getBytes());
      String extension = Helper.getExtension(multipartFile);
      profile.setProfilePictureExtension(extension);
    }
    return profile;
  }

  public static ResponseProfileDTO profileToResponseProfileDTO(Profile profile) {
    ResponseProfileDTO responseProfileDTO = new ResponseProfileDTO();
    responseProfileDTO.setProfileId(profile.getProfileId());
    responseProfileDTO.setProfileName(profile.getProfileName());
    responseProfileDTO.setProfileDescription(profile.getProfileDescription());
    responseProfileDTO.setProfileColorCode(profile.getProfileColorCode());
    responseProfileDTO.setProfilePicture(
        profile.getProfilePictureExtension()
            + Base64.getEncoder().encodeToString(profile.getProfilePicture()));
    responseProfileDTO.setAccountIds(
        profile.getAccounts().parallelStream().map(Account::getAccountId).collect(Collectors.toSet()));
    responseProfileDTO.setCategoryIds(
        profile.getCategories().parallelStream().map(Category::getCategoryId).collect(Collectors.toSet()));
    responseProfileDTO.setExpenseIds(
        profile.getExpenses().parallelStream().map(Expense::getExpenseId).collect(Collectors.toSet()));
    return responseProfileDTO;
  }

  public static List<ResponseProfileDTO> profilesToResponseProfileDTOs(List<Profile> profiles) {
    return profiles.parallelStream().map(ProfileMapper::profileToResponseProfileDTO).toList();
  }
}
