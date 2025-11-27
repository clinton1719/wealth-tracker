package com.backend.wealth_tracker.exception;

import java.io.Serial;

public class SecurityConfigurationException extends RuntimeException {
  @Serial private static final long serialVersionUID = 1L;

  public SecurityConfigurationException(String message, Throwable cause) {
    super(message, cause);
  }
}
