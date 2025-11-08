package com.backend.wealth_tracker.exception;

public class InvalidJwtException extends Throwable {
    public InvalidJwtException(String message, Throwable cause) {
        super(message, cause);
    }

    public InvalidJwtException(String message) {
        super(message);
    }
}
