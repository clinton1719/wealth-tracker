package com.backend.wealth_tracker.helper;

import java.math.BigDecimal;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

public final class Constants {
  /*** PDF CONSTANTS STARTS **/
  public static final String FONT_FAMILY = "Noto Sans";

  public static final String REGULAR_FONT_LOCATION = "/fonts/NotoSans-Regular.ttf";
  public static final String REGULAR_ITALIC_FONT_LOCATION = "/fonts/NotoSans-Italic.ttf";
  public static final String BOLD_FONT_LOCATION = "/fonts/NotoSans-Bold.ttf";
  public static final String BOLD_ITALIC_FONT_LOCATION = "/fonts/NotoSans-BoldItalic.ttf";
  public static final String EXPENSE_REPORT_NAME = "expense";
  public static final String EXPENSE_REPORT_TITLE = "Expense Report";
  public static final String BASE_HTML_LOCATION = "pdf/layout/base.html";
  public static final String BASE_CSS_LOCATION = "pdf/css/base.css";
  public static final String EXPENSE_REPORT_LOCATION = "pdf/reports/expense/expense-report.html";
  public static final String EXPENSE_CSS_LOCATION = "pdf/reports/expense/expense.css";
  public static final String EXPENSE_REPORT_FILE_NAME = "expense-report.pdf";
  public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd-MM-yyyy");

  /*** SWAGGER CONSTANTS STARTS ***/
  public static final String READ_CALL_TAG = "READ";

  public static final String CREATE_CALL_TAG = "CREATE";
  public static final String UPDATE_CALL_TAG = "UPDATE";
  public static final String DELETE_CALL_TAG = "DELETE";

  private Constants() {}

  public static String formatCurrency(BigDecimal amount) {
    return NumberFormat.getCurrencyInstance(Locale.of("en", "IN")).format(amount);
  }
}
