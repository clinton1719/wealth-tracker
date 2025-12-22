package com.backend.wealth_tracker.exception;

import java.io.Serial;

public class PdfGenerationException extends Exception {
  @Serial private static final long serialVersionUID = 1L;

  public PdfGenerationException(String message, Throwable cause) {
    super(message, cause);
  }

  public PdfGenerationException(String message) {
    super(message);
  }
}
