package com.backend.wealth_tracker.controller;

import static com.backend.wealth_tracker.helper.Constants.EXPENSE_REPORT_FILE_NAME;
import static com.backend.wealth_tracker.helper.Constants.EXPENSE_REPORT_NAME;

import com.backend.wealth_tracker.dto.request_dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.*;
import com.backend.wealth_tracker.dto.update_dto.UpdateExpenseDTO;
import com.backend.wealth_tracker.exception.AccountCannotHaveNegativeBalanceException;
import com.backend.wealth_tracker.exception.PdfGenerationException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.exception.UnAuthorizedException;
import com.backend.wealth_tracker.mapper.ExpenseMapper;
import com.backend.wealth_tracker.pdf.PdfReportGenerator;
import com.backend.wealth_tracker.pdf.PdfReportRegistry;
import com.backend.wealth_tracker.service.ExpenseService;
import com.backend.wealth_tracker.service.ExpenseStatisticsService;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/expenses")
@Tag(name = "Expense", description = "API methods to manipulate Expense data")
public class ExpenseController {
  private static final String GET_MAPPING_TAG = "FIND";
  private static final String REPORT_MAPPING_TAG = "REPORT";
  private final ExpenseService expenseService;
  private final ExpenseStatisticsService expenseStatisticsService;
  private final PdfReportRegistry pdfReportRegistry;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public ExpenseController(
      ExpenseService expenseService,
      ExpenseStatisticsService expenseStatisticsService,
      PdfReportRegistry pdfReportRegistry) {
    this.expenseService = expenseService;
    this.expenseStatisticsService = expenseStatisticsService;
    this.pdfReportRegistry = pdfReportRegistry;
  }

  @GetMapping("/range")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = GET_MAPPING_TAG)
  public List<ResponseExpenseDTO> getExpensesInRange(
      @RequestParam String startDate, @RequestParam String endDate) {
    return ExpenseMapper.expenseSummaryProjectionsToResponseExpenseDTOs(
        this.expenseService.getExpensesInRange(startDate, endDate));
  }

  @GetMapping("/by-category-and-created-at")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = GET_MAPPING_TAG)
  public List<ResponseCategoryExpenseDTO> getExpensesByCategoryAndCreatedAt(
      @RequestParam String startDate, @RequestParam String endDate) {
    return ExpenseMapper.categoryExpenseSummaryProjectionsToResponseCategoryExpenseDTOs(
        this.expenseStatisticsService.getExpensesByCategoryAndCreatedAt(startDate, endDate));
  }

  @GetMapping("/by-tag-and-created-at")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = GET_MAPPING_TAG)
  public List<ResponseTagExpenseDTO> getExpensesByTagAndCreatedAt(
      @RequestParam String startDate, @RequestParam String endDate) {
    return ExpenseMapper.tagExpenseSummaryProjectionsToResponseCategoryExpenseDTOs(
        this.expenseStatisticsService.getExpensesByTagAndCreatedAt(startDate, endDate));
  }

  @GetMapping("/by-monthly-category-and-created-at")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = GET_MAPPING_TAG)
  public List<ResponseCategoryMonthlyExpenseDTO> getMonthlyExpensesByCategory(
      @RequestParam String startDate, @RequestParam String endDate) {
    return ExpenseMapper.categoryMonthlyExpenseProjectionsToResponseCategoryExpenseDTOs(
        this.expenseStatisticsService.getMonthlyExpensesByCategory(startDate, endDate));
  }

  @GetMapping("/by-monthly-tag-and-created-at")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = GET_MAPPING_TAG)
  public List<ResponseTagMonthlyExpenseDTO> getMonthlyExpensesByTag(
      @RequestParam String startDate, @RequestParam String endDate) {
    return ExpenseMapper.tagMonthlyExpenseProjectionsToResponseTagExpenseDTOs(
        this.expenseStatisticsService.getMonthlyExpensesByTag(startDate, endDate));
  }

  @PostMapping(path = "/save")
  @ResponseStatus(HttpStatus.CREATED)
  @Tag(name = "SAVE")
  public ResponseExpenseDTO saveExpense(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody CreateExpenseDTO createExpenseDTO)
      throws ResourceNotFoundException,
          UnAuthorizedException,
          AccountCannotHaveNegativeBalanceException {
    return ExpenseMapper.expenseToResponseExpenseDTO(
        this.expenseService.saveExpense(createExpenseDTO, userDetails.getUsername()));
  }

  @GetMapping("/report")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = REPORT_MAPPING_TAG)
  @SuppressWarnings("unchecked")
  public ResponseEntity<byte[]> getExpensesReport(
      @RequestParam String startDate, @RequestParam String endDate) throws PdfGenerationException {
    PdfReportGenerator<String[]> pdfReportGenerator =
        (PdfReportGenerator<String[]>) pdfReportRegistry.get(EXPENSE_REPORT_NAME);
    byte[] pdfContentBytes = pdfReportGenerator.generate(new String[] {startDate, endDate});
    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.APPLICATION_PDF);
    headers.setContentDispositionFormData("attachment", EXPENSE_REPORT_FILE_NAME);
    headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
    return new ResponseEntity<>(pdfContentBytes, headers, HttpStatus.OK);
  }

  @PutMapping(path = "/update")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = "UPDATE")
  public ResponseExpenseDTO updateExpense(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody UpdateExpenseDTO updateExpenseDTO)
      throws ResourceNotFoundException,
          UnAuthorizedException,
          AccountCannotHaveNegativeBalanceException {
    return ExpenseMapper.expenseToResponseExpenseDTO(
        this.expenseService.updateExpense(updateExpenseDTO, userDetails.getUsername()));
  }

  @DeleteMapping(path = "/delete/{id}")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = "DELETE")
  public void updateExpense(@PathVariable Long id) throws ResourceNotFoundException {
    this.expenseService.deleteExpense(id);
  }
}
