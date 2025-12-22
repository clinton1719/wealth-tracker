package com.backend.wealth_tracker.pdf.generators;

import static com.backend.wealth_tracker.helper.Constants.*;
import static com.backend.wealth_tracker.helper.Helper.loadWebContentFromResources;

import com.backend.wealth_tracker.dto.request_dto.ExpenseReportRequest;
import com.backend.wealth_tracker.exception.PdfGenerationException;
import com.backend.wealth_tracker.model.ExpenseReportModel;
import com.backend.wealth_tracker.projections.ExpenseReportSummaryProjection;
import com.backend.wealth_tracker.service.ExpenseService;
import com.backend.wealth_tracker.service.PdfRenderService;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.apache.commons.text.StringEscapeUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ExpenseReportGenerator
    extends AbstractPdfReportGenerator<ExpenseReportRequest, ExpenseReportModel> {

  private static final Logger LOGGER = LoggerFactory.getLogger(ExpenseReportGenerator.class);

  private final ExpenseService expenseService;

  public ExpenseReportGenerator(PdfRenderService pdfRenderService, ExpenseService expenseService) {
    super(pdfRenderService);
    this.expenseService = expenseService;
  }

  private static StringBuilder getExpensesTableRows(ExpenseReportModel model) {
    StringBuilder rows = new StringBuilder();
    for (ExpenseReportSummaryProjection e : model.expenseRowList()) {
      rows.append(
          """
                    <tr>
                      <td>%s</td>
                      <td>%s</td>
                      <td>%s</td>
                      <td>%s</td>
                      <td>%s</td>
                      <td class="amount">%s</td>
                    </tr>
                    """
              .formatted(
                  StringEscapeUtils.escapeHtml4(DATE_FORMATTER.format(e.getExpenseCreatedAt())),
                  StringEscapeUtils.escapeHtml4(e.getCategoryName()),
                  StringEscapeUtils.escapeHtml4(e.getExpenseDescription()),
                  StringEscapeUtils.escapeHtml4(e.getProfileName()),
                  StringEscapeUtils.escapeHtml4(e.getAccountName()),
                  StringEscapeUtils.escapeHtml4(formatCurrency(e.getExpenseAmount()))));
    }
    return rows;
  }

  @Override
  protected ExpenseReportModel loadData(ExpenseReportRequest expenseReportRequest) {
    List<ExpenseReportSummaryProjection> expenseReportSummaryProjectionList =
        expenseService.getExpensesWithNamesInRange(
            expenseReportRequest.startDate(), expenseReportRequest.endDate());
    Map<String, byte[]> chartImagesMap = expenseReportRequest.chartImagesMap();
    BigDecimal total =
        expenseReportSummaryProjectionList.stream()
            .map(ExpenseReportSummaryProjection::getExpenseAmount)
            .filter(Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    String totalExpensesFormatted = formatCurrency(total);
    ExpenseReportModel expenseReportModel =
        new ExpenseReportModel(
            expenseReportSummaryProjectionList,
            totalExpensesFormatted,
            expenseReportRequest.startDate(),
            expenseReportRequest.endDate(),
            chartImagesMap);
    LOGGER.atInfo().log(
        "Model generated for report with {} entries", expenseReportModel.expenseRowList().size());
    return expenseReportModel;
  }

  @Override
  protected String renderHtml(ExpenseReportModel model) throws PdfGenerationException {
    String baseHtml = loadWebContentFromResources(BASE_HTML_LOCATION);
    String baseCss = loadWebContentFromResources(BASE_CSS_LOCATION);
    String expenseCss = loadWebContentFromResources(EXPENSE_CSS_LOCATION);
    String content = loadWebContentFromResources(EXPENSE_REPORT_LOCATION);

    String html =
        baseHtml
            .replace("{{TITLE}}", model.title())
            .replace("{{BASE_CSS}}", baseCss)
            .replace("{{CSS}}", expenseCss)
            .replace("{{CONTENT}}", content);

    StringBuilder rows = getExpensesTableRows(model);

    html =
        html.replace("{{ROWS}}", rows.toString())
            .replace("{{startDate}}", DATE_FORMATTER.format(LocalDate.parse(model.startDate())))
            .replace("{{endDate}}", DATE_FORMATTER.format(LocalDate.parse(model.endDate())))
            .replace(
                "{{categoryTable}}",
                Base64.getEncoder().encodeToString(model.chartImagesMap().get("categoryTable")))
            .replace(
                "{{tagTable}}",
                Base64.getEncoder().encodeToString(model.chartImagesMap().get("tagTable")))
            .replace(
                "{{categoryPie}}",
                Base64.getEncoder().encodeToString(model.chartImagesMap().get("categoryPie")))
            .replace(
                "{{tagPie}}",
                Base64.getEncoder().encodeToString(model.chartImagesMap().get("tagPie")))
            .replace(
                "{{categoryLine}}",
                Base64.getEncoder().encodeToString(model.chartImagesMap().get("categoryLine")))
            .replace(
                "{{tagLine}}",
                Base64.getEncoder().encodeToString(model.chartImagesMap().get("tagLine")))
            .replace(
                "{{expenseLine}}",
                Base64.getEncoder().encodeToString(model.chartImagesMap().get("expenseLine")))
            .replace("{{TOTAL}}", model.totalExpensesFormatted());

    return html;
  }

  @Override
  public String reportName() {
    return EXPENSE_REPORT_NAME;
  }
}
