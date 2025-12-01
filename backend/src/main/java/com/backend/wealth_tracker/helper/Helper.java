package com.backend.wealth_tracker.helper;

import java.io.IOException;
import org.apache.tika.Tika;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

public final class Helper {
  private Helper() {}

  private static final String pngType = "image/png";
  private static final String jpegType = "image/jpeg";

  public static String getExtension(MultipartFile multipartFile) throws IOException {
    Tika tika = new Tika();
    String detectedType = tika.detect(multipartFile.getBytes());
    String extension;
    if (pngType.equals(detectedType)) {
      extension = "data:image/png;base64,";
    } else if (jpegType.equals(detectedType)) {
      extension = "data:image/jpeg;base64,";
    } else {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST, "Invalid image type: " + detectedType);
    }
    return extension;
  }
}
