package com.backend.wealth_tracker.projections;

import java.math.BigDecimal;
import java.time.LocalDate;

public interface ExpenseReportSummaryProjection {
  String getExpenseDescription();

  BigDecimal getExpenseAmount();

  String getCategoryName();

  String getAccountName();

  String getProfileName();

  LocalDate getExpenseCreatedAt();
}
