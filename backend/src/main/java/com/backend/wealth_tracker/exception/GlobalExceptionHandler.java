package com.backend.wealth_tracker.exception;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

  private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

  @ExceptionHandler(IOException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public String handleAllIOExceptions(IOException ex) {
    LOGGER.atError().log("IO exception: {}", (Object) ex.getStackTrace());
    return "Possible issue with file(s), please check";
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseEntity<Map<String, String>> handleValidationExceptions(
      MethodArgumentNotValidException ex) {
    Map<String, String> errors = new HashMap<>();
    ex.getBindingResult()
        .getAllErrors()
        .forEach(
            (error) -> {
              String fieldName = ((FieldError) error).getField();
              String errorMessage = error.getDefaultMessage();
              errors.put(fieldName, errorMessage);
            });
    LOGGER.atError().log(errors.toString(), (Object) ex.getStackTrace());
    return ResponseEntity.badRequest().body(errors);
  }

  @ExceptionHandler(UnAuthorizedException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public String handleAllUnAuthorizedExceptions(UnAuthorizedException ex) {
    LOGGER.atError().log("Unauthorized exception: {}", (Object) ex.getStackTrace());
    return "Unauthorized access";
  }

  @ExceptionHandler(ResourceAlreadyExistsException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public String handleAllResourceAlreadyExistsExceptions(ResourceAlreadyExistsException ex) {
    LOGGER.atError().log("Resource already exists exception: {}", (Object) ex.getStackTrace());
    return "Resource already exists";
  }

  @ExceptionHandler(RuntimeException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public String handleAllResourceAlreadyExistsExceptions(RuntimeException ex) {
    LOGGER.atError().log("Server error: {}", (Object) ex.getStackTrace());
    return "Something went wrong on server, kindly try again later";
  }
}
