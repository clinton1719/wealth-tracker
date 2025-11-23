package com.backend.wealth_tracker.exception;

public class UnAuthorizedException extends Exception {
  public UnAuthorizedException(String message, Throwable cause) {
    super(message, cause);
  }

  public UnAuthorizedException(String message) {
    super(message);
  }
}
