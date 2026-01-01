package com.backend.wealth_tracker.dto.response_dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;

public record ResponseExpenseDTO (
  @NotNull Long expenseId,
  @NotNull BigDecimal expenseAmount,
  @NotBlank String expenseDescription,

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
  @NotNull
  LocalDate expenseCreatedAt,

  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
  @NotNull
  LocalDate expenseUpdatedAt,

  @NotBlank Long categoryId,
  @NotNull Long profileId,
  @NotNull Long accountId
) {}
