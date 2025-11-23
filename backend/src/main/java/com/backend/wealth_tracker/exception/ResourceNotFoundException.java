package com.backend.wealth_tracker.exception;

import java.io.Serial;

public class ResourceNotFoundException extends Exception {
  @Serial private static final long serialVersionUID = 1L;

  public ResourceNotFoundException(String message, Throwable cause) {
    super(message, cause);
  }

  public ResourceNotFoundException(String message) {
    super(message);
  }
}
