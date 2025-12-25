package com.backend.wealth_tracker.model;

import com.backend.wealth_tracker.helper.Constants;
import com.backend.wealth_tracker.projections.expense.ExpenseReportSummaryProjection;
import java.util.List;
import java.util.Map;

public record ExpenseReportModel(
    String title,
    List<ExpenseReportSummaryProjection> expenseRowList,
    String totalExpensesFormatted,
    String startDate,
    String endDate,
    Map<String, byte[]> chartImagesMap) {
  public ExpenseReportModel(
      List<ExpenseReportSummaryProjection> rows,
      String totalFormatted,
      String startDate,
      String endDate,
      Map<String, byte[]> chartImagesMap) {
    this(Constants.EXPENSE_REPORT_TITLE, rows, totalFormatted, startDate, endDate, chartImagesMap);
  }
}
