package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.model.Profile;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.ProfileRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Profile service test")
class ProfileServiceTest {

  private static final String userName = "testUser";
  @Mock private ProfileRepository profileRepository;
  @Mock private AuthService authService;
  @InjectMocks private ProfileService profileService;
  private User user;
  private List<Profile> expectedProfiles;

  @BeforeEach
  void setUp() {
    user = new User();
    user.setId(1L);

    Profile profile1 = new Profile();
    profile1.setProfileId(10L);
    profile1.setProfileName("Personal");

    Profile profile2 = new Profile();
    profile2.setProfileId(20L);
    profile2.setProfileName("Work");

    expectedProfiles = List.of(profile1, profile2);
  }

//  @ParameterizedTest(name = "Test Profile: ID={0}, Name={1}")
//  @CsvFileSource(resources = "/profiles-test-data.csv", numLinesToSkip = 1)
  void getAllProfilesForUserTest(long profileId, String profileName)
      throws ResourceNotFoundException {
    Profile mockProfile = new Profile();
    mockProfile.setProfileId(profileId);
    mockProfile.setProfileName(profileName);

    List<Profile> expectedList = List.of(mockProfile);

    when(authService.getUserByUsername(userName)).thenReturn(user);
    when(profileRepository.findAllWithRelations(user.getId())).thenReturn(expectedList);

    List<Profile> result = profileService.getAllProfilesForUser(userName);

    assertAll(
        "Validate dynamic profile",
        () -> assertNotNull(result),
        () -> assertEquals(1, result.size()),
        () -> assertEquals(profileName, result.getFirst().getProfileName()));

    verify(authService).getUserByUsername(userName);
  }

  @Test
  @DisplayName("Get all profiles should throw exception for user not found")
  void getAllProfilesForUserShouldThrowExceptionTest() throws ResourceNotFoundException {
    when(authService.getUserByUsername(userName))
        .thenThrow(new ResourceNotFoundException("User not found with username: " + userName));

    assertThrows(
        ResourceNotFoundException.class,
        () -> profileService.getAllProfilesForUser(userName),
        "Should throw exception for user not found");
  }
}
