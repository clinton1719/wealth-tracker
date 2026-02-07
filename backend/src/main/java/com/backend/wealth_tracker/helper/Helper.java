package com.backend.wealth_tracker.helper;

import com.backend.wealth_tracker.exception.PdfGenerationException;
import com.backend.wealth_tracker.account.model.Account;
import com.backend.wealth_tracker.category.model.Category;
import com.backend.wealth_tracker.profile.model.Profile;
import org.apache.tika.Tika;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.Set;

public final class Helper {
  private static final String PNG_TYPE = "image/png";
  private static final String JPEG_TYPE = "image/jpeg";

  private Helper() {}

  public static String getExtension(MultipartFile multipartFile) throws IOException {
    Tika tika = new Tika();
    String detectedType = tika.detect(multipartFile.getBytes());
    String extension;
    if (PNG_TYPE.equals(detectedType)) {
      extension = "data:image/png;base64,";
    } else if (JPEG_TYPE.equals(detectedType)) {
      extension = "data:image/jpeg;base64,";
    } else {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Invalid image type: " + detectedType);
    }
    return extension;
  }

  public static boolean isProfileIdValid(Set<Profile> profiles, Long profileId) {
    return profiles.parallelStream()
        .anyMatch(profile -> Objects.equals(profile.getProfileId(), profileId));
  }

  public static boolean isAccountIdValid(Set<Account> accounts, Long accountId) {
    return accounts.parallelStream()
        .anyMatch(account -> Objects.equals(account.getAccountId(), accountId));
  }

  public static boolean isCategoryIdValid(Set<Category> categories, Long categoryId) {
    return categories.parallelStream()
        .anyMatch(category -> Objects.equals(category.getCategoryId(), categoryId));
  }

  public static boolean isCategoryIdProfileIdAndAccountIdValid(
      Set<Category> categories,
      Long categoryId,
      Set<Profile> profiles,
      Long profileId,
      Set<Account> accounts,
      Long accountId) {
    return isCategoryIdValid(categories, categoryId)
        && isProfileIdValid(profiles, profileId)
        && isAccountIdValid(accounts, accountId);
  }

  private static InputStream getResourceStream(String path) throws IOException {
    return new ClassPathResource(path).getInputStream();
  }

  public static String loadWebContentFromResources(String path) throws PdfGenerationException {
    try (InputStream is = getResourceStream(path)) {
      return new String(is.readAllBytes(), StandardCharsets.UTF_8);
    } catch (IOException e) {
      throw new PdfGenerationException("Failed to load web content for PDF rendering", e);
    }
  }
}
