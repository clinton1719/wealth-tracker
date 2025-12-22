package com.backend.wealth_tracker.controller;

import static com.backend.wealth_tracker.helper.Constants.EXPENSE_REPORT_FILE_NAME;
import static com.backend.wealth_tracker.helper.Constants.EXPENSE_REPORT_NAME;

import com.backend.wealth_tracker.dto.request_dto.ExpenseReportRequest;
import com.backend.wealth_tracker.exception.PdfGenerationException;
import com.backend.wealth_tracker.pdf.PdfReportGenerator;
import com.backend.wealth_tracker.pdf.PdfReportRegistry;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/expenses/statistics")
@Tag(name = "Expense", description = "API methods to generate expense statistics")
public class ExpenseStatisticsController {
  private static final String REPORT_MAPPING_TAG = "REPORT";
  private final PdfReportRegistry pdfReportRegistry;

  public ExpenseStatisticsController(PdfReportRegistry pdfReportRegistry) {
    this.pdfReportRegistry = pdfReportRegistry;
  }

  @PostMapping(value = "/report", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = REPORT_MAPPING_TAG)
  @SuppressWarnings("unchecked")
  public ResponseEntity<byte[]> getExpensesReport(
      @RequestParam String startDate,
      @RequestParam String endDate,
      @RequestParam List<MultipartFile> chartImages)
      throws PdfGenerationException, IOException {
    PdfReportGenerator<ExpenseReportRequest> pdfReportGenerator =
        (PdfReportGenerator<ExpenseReportRequest>) pdfReportRegistry.get(EXPENSE_REPORT_NAME);
    Map<String, byte[]> chartImagesMap = new HashMap<>();
    for (MultipartFile file : chartImages) {
      String filename = file.getOriginalFilename();
      byte[] data = file.getBytes();
      chartImagesMap.put(filename, data);
    }
    ExpenseReportRequest expenseReportRequest =
        new ExpenseReportRequest(startDate, endDate, chartImagesMap);
    byte[] pdfContentBytes = pdfReportGenerator.generate(expenseReportRequest);
    return ResponseEntity.ok()
        .contentType(MediaType.APPLICATION_PDF)
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            "attachment; filename=\"" + EXPENSE_REPORT_FILE_NAME + "\"")
        .cacheControl(CacheControl.noCache().mustRevalidate())
        .body(pdfContentBytes);
  }
}
