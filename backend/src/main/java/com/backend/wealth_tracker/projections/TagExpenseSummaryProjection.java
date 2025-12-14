package com.backend.wealth_tracker.projections;

import java.math.BigDecimal;

public interface TagExpenseSummaryProjection {
  String getTag();

  Long getProfileId();

  BigDecimal getExpenseAmount();

  String getProfileColorCode();
}
