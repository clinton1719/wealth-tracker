package com.backend.wealth_tracker.exception;

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
    LOGGER.error(errors.toString(), ex);
    return ResponseEntity.badRequest().body(errors);
  }

  @ExceptionHandler(UnAuthorizedException.class)
  @ResponseStatus(HttpStatus.UNAUTHORIZED)
  public String handleAllUnAuthorizedExceptions(UnAuthorizedException ex) {
    LOGGER.error("Unauthorized exception: {}", ex.getMessage());
    return "Unauthorized access";
  }

  @ExceptionHandler(ResourceNotFoundException.class)
  @ResponseStatus(HttpStatus.NOT_FOUND)
  public String handleAllResourceNotFoundExceptions(ResourceNotFoundException ex) {
    LOGGER.error("Resource not found exception: {}", ex.getMessage());
    return "Resource not found";
  }

  @ExceptionHandler(ResourceAlreadyExistsException.class)
  @ResponseStatus(HttpStatus.CONFLICT)
  public String handleAllResourceAlreadyExistsExceptions(ResourceAlreadyExistsException ex) {
    LOGGER.error("Resource already exists exception: {}", ex.getMessage());
    return "Resource already exists";
  }

  @ExceptionHandler(RuntimeException.class)
  @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
  public String handleAllResourceAlreadyExistsExceptions(RuntimeException ex) {
    LOGGER.error("Server error: {}", ex.getMessage());
    return "Something went wrong on server, kindly try again later";
  }
}
