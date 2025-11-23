package com.backend.wealth_tracker.mapper;

import com.backend.wealth_tracker.dto.request_dto.CreateProfileDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseProfileDTO;
import com.backend.wealth_tracker.model.Account;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.Expense;
import com.backend.wealth_tracker.model.Profile;
import java.util.List;
import java.util.stream.Collectors;

public class ProfileMapper {
  public static Profile createProfileDTOToProfile(CreateProfileDTO createProfileDTO) {
    Profile profile = new Profile();
    profile.setProfileName(createProfileDTO.getProfileName());
    profile.setDescription(createProfileDTO.getDescription());
    profile.setColorCode(createProfileDTO.getColorCode());
    profile.setProfilePicture(createProfileDTO.getProfilePicture());
    return profile;
  }

  public static ResponseProfileDTO profileToResponseProfileDTO(Profile profile) {
    ResponseProfileDTO responseProfileDTO = new ResponseProfileDTO();
    responseProfileDTO.setProfileName(profile.getProfileName());
    responseProfileDTO.setDescription(profile.getDescription());
    responseProfileDTO.setColorCode(profile.getColorCode());
    responseProfileDTO.setProfilePicture(profile.getProfilePicture());
    responseProfileDTO.setAccountIds(
        profile.getAccounts().parallelStream().map(Account::getId).collect(Collectors.toSet()));
    responseProfileDTO.setCategoryIds(
        profile.getCategories().parallelStream().map(Category::getId).collect(Collectors.toSet()));
    responseProfileDTO.setExpenseIds(
        profile.getExpenses().parallelStream().map(Expense::getId).collect(Collectors.toSet()));
    return responseProfileDTO;
  }

  public static List<ResponseProfileDTO> profilesToResponseProfileDTOs(List<Profile> profiles) {
    return profiles.parallelStream().map(ProfileMapper::profileToResponseProfileDTO).toList();
  }
}
