package com.backend.wealth_tracker.projections;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface CategoryMonthlyExpenseProjection {
    String getCategoryName();

    String getCategoryColorCode();

    LocalDateTime getMonth();

    BigDecimal getExpenseAmount();

    Long getProfileId();
}
