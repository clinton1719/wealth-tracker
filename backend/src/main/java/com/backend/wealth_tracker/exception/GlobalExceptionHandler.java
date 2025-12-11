package com.backend.wealth_tracker.exception;

import jakarta.validation.ConstraintViolationException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger LOGGER = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(AccountCannotHaveNegativeBalanceException.class)
    @ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
    public String handleAccountCannotHaveNegativeBalanceException(AccountCannotHaveNegativeBalanceException ex) {
        LOGGER.atError().log("Negative balance in account error: {}", ex.getMessage(), ex);
        return "Invalid operation";
    }

    @ExceptionHandler(IOException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String handleAllIOExceptions(IOException ex) {
        LOGGER.atError().log("IO exception: {}", ex.getMessage(), ex);
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
        LOGGER.atError().log(errors.toString(), ex.getMessage(), ex);
        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(TransactionSystemException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ResponseEntity<?> handleTransactionSystemException(TransactionSystemException ex) {
        Throwable rootCause = ex.getRootCause();

        if (rootCause instanceof ConstraintViolationException violationEx) {
            String msg = violationEx.getConstraintViolations()
                    .stream()
                    .map(v -> v.getPropertyPath() + ": " + v.getMessage())
                    .findFirst()
                    .orElse("Validation failed");

            return ResponseEntity.badRequest().body(Map.of("error", msg));
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Transaction failed");
    }

    @ExceptionHandler(UnAuthorizedException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public String handleAllUnAuthorizedExceptions(UnAuthorizedException ex) {
        LOGGER.atError().log("Unauthorized exception: {}", ex.getMessage(), ex);
        return "Unauthorized access";
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public String handleAllResourceAlreadyExistsExceptions(ResourceAlreadyExistsException ex) {
        LOGGER.atError().log("Resource already exists exception: {}", ex.getMessage(), ex);
        return "Resource already exists";
    }

    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public String handleAllResourceAlreadyExistsExceptions(RuntimeException ex) {
        LOGGER.atError().log("Server error: {}", ex.getMessage(), ex);
        return "Something went wrong on server, kindly try again later";
    }
}
