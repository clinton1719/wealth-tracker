package com.backend.wealth_tracker.projections;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface TagMonthlyExpenseProjection {
  String getTag();

  LocalDateTime getMonth();

  BigDecimal getExpenseAmount();

  Long getProfileId();
}
