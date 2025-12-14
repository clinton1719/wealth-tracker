package com.backend.wealth_tracker.projections;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface ExpenseSummaryProjection {
  Long getExpenseId();

  String getExpenseDescription();

  BigDecimal getExpenseAmount();

  Long getCategoryId();

  Long getAccountId();

  Long getProfileId();

  LocalDate getExpenseCreatedAt();

  LocalDate getExpenseUpdatedAt();
}
