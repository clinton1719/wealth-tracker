package com.backend.wealth_tracker.controller;

import com.backend.wealth_tracker.dto.request_dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.*;
import com.backend.wealth_tracker.dto.update_dto.UpdateExpenseDTO;
import com.backend.wealth_tracker.exception.AccountCannotHaveNegativeBalanceException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.exception.UnAuthorizedException;
import com.backend.wealth_tracker.mapper.ExpenseMapper;
import com.backend.wealth_tracker.service.expense.ExpenseService;
import com.backend.wealth_tracker.service.expense.ExpenseStatisticsService;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.backend.wealth_tracker.helper.Constants.*;

@RestController
@RequestMapping("/api/v1/expenses")
@Tag(name = "Expense", description = "API methods to manipulate Expense data")
public class ExpenseController {
  private final ExpenseService expenseService;
  private final ExpenseStatisticsService expenseStatisticsService;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public ExpenseController(
      ExpenseService expenseService, ExpenseStatisticsService expenseStatisticsService) {
    this.expenseService = expenseService;
    this.expenseStatisticsService = expenseStatisticsService;
  }

  @GetMapping("/range")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = READ_CALL_TAG)
  public List<ResponseExpenseDTO> getExpensesInRange(
      @RequestParam String startDate, @RequestParam String endDate) {
    return ExpenseMapper.expenseSummaryProjectionsToResponseExpenseDTOs(
        this.expenseService.getExpensesInRange(startDate, endDate));
  }

  @GetMapping("/by-category-and-created-at")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = READ_CALL_TAG)
  public List<ResponseCategoryExpenseDTO> getExpensesByCategoryAndCreatedAt(
      @RequestParam String startDate, @RequestParam String endDate) {
    return ExpenseMapper.categoryExpenseSummaryProjectionsToResponseCategoryExpenseDTOs(
        this.expenseStatisticsService.getExpensesByCategoryAndCreatedAt(startDate, endDate));
  }

  @GetMapping("/by-tag-and-created-at")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = READ_CALL_TAG)
  public List<ResponseTagExpenseDTO> getExpensesByTagAndCreatedAt(
      @RequestParam String startDate, @RequestParam String endDate) {
    return ExpenseMapper.tagExpenseSummaryProjectionsToResponseCategoryExpenseDTOs(
        this.expenseStatisticsService.getExpensesByTagAndCreatedAt(startDate, endDate));
  }

  @GetMapping("/by-monthly-category-and-created-at")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = READ_CALL_TAG)
  public List<ResponseCategoryMonthlyExpenseDTO> getMonthlyExpensesByCategory(
      @RequestParam String startDate, @RequestParam String endDate) {
    return ExpenseMapper.categoryMonthlyExpenseProjectionsToResponseCategoryExpenseDTOs(
        this.expenseStatisticsService.getMonthlyExpensesByCategory(startDate, endDate));
  }

  @GetMapping("/by-monthly-tag-and-created-at")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = READ_CALL_TAG)
  public List<ResponseTagMonthlyExpenseDTO> getMonthlyExpensesByTag(
      @RequestParam String startDate, @RequestParam String endDate) {
    return ExpenseMapper.tagMonthlyExpenseProjectionsToResponseTagExpenseDTOs(
        this.expenseStatisticsService.getMonthlyExpensesByTag(startDate, endDate));
  }

  @PostMapping(path = "/save")
  @ResponseStatus(HttpStatus.CREATED)
  @Tag(name = CREATE_CALL_TAG)
  public ResponseExpenseDTO saveExpense(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody CreateExpenseDTO createExpenseDTO)
      throws ResourceNotFoundException,
          UnAuthorizedException,
          AccountCannotHaveNegativeBalanceException {
    return ExpenseMapper.expenseToResponseExpenseDTO(
        this.expenseService.saveExpense(createExpenseDTO, userDetails.getUsername()));
  }

  @PutMapping(path = "/update")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = UPDATE_CALL_TAG)
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
  @Tag(name = DELETE_CALL_TAG)
  public void updateExpense(@PathVariable Long id) throws ResourceNotFoundException {
    this.expenseService.deleteExpense(id);
  }
}
