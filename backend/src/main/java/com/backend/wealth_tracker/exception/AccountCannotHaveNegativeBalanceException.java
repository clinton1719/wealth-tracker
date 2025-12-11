package com.backend.wealth_tracker.exception;

import java.io.Serial;

public class AccountCannotHaveNegativeBalanceException extends Exception {
  @Serial private static final long serialVersionUID = 1L;

  public AccountCannotHaveNegativeBalanceException(String message, Throwable cause) {
    super(message, cause);
  }

  public AccountCannotHaveNegativeBalanceException() {
    super();
  }
}
