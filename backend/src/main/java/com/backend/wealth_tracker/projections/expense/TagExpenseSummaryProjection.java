package com.backend.wealth_tracker.projections.expense;

import java.math.BigDecimal;

public interface TagExpenseSummaryProjection {
  String getTag();

  Long getProfileId();

  BigDecimal getExpenseAmount();

  String getProfileColorCode();
}
