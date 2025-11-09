package com.backend.wealth_tracker.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

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
        return "Resource not found";
    }
}
