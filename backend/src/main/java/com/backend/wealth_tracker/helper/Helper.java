package com.backend.wealth_tracker.helper;

import org.apache.tika.Tika;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;

public class Helper {
    public static String getExtension(MultipartFile multipartFile) throws IOException {
        Tika tika = new Tika();
        String detectedType = tika.detect(multipartFile.getBytes());
        String extension;
        if (detectedType.equals("image/png")) {
            extension = "data:image/png;base64,";
        } else if (detectedType.equals("image/jpeg")){
            extension = "data:image/jpeg;base64,";
        } else {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid image type: " + detectedType
            );
        }
        return extension;
    }
}
