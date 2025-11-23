package com.backend.wealth_tracker.exception;

import java.io.Serial;

public class UnAuthorizedException extends Exception {
  @Serial private static final long serialVersionUID = 1L;

  public UnAuthorizedException(String message, Throwable cause) {
    super(message, cause);
  }

  public UnAuthorizedException(String message) {
    super(message);
  }
}
