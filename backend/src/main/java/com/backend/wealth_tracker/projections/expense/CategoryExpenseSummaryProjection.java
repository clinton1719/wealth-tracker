package com.backend.wealth_tracker.projections.expense;

import java.math.BigDecimal;

public interface CategoryExpenseSummaryProjection {
  String getCategoryName();

  String getCategoryColorCode();

  String getCategoryIcon();

  Long getProfileId();

  String getProfileColorCode();

  BigDecimal getExpenseAmount();
}
