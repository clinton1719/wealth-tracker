package com.backend.wealth_tracker.model;

import com.backend.wealth_tracker.helper.Constants;
import com.backend.wealth_tracker.projections.ExpenseReportSummaryProjection;
import java.util.List;

public record ExpenseReportModel(
    String title,
    List<ExpenseReportSummaryProjection> expenseRowList,
    String totalExpensesFormatted,
    String startDate,
    String endDate) {
  public ExpenseReportModel(
      List<ExpenseReportSummaryProjection> rows,
      String totalFormatted,
      String startDate,
      String endDate) {
    this(Constants.EXPENSE_REPORT_TITLE, rows, totalFormatted, startDate, endDate);
  }
}
