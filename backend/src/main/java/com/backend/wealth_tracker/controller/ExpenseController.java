package com.backend.wealth_tracker.controller;

import com.backend.wealth_tracker.dto.request_dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseCategoryExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseTagExpenseDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateExpenseDTO;
import com.backend.wealth_tracker.exception.AccountCannotHaveNegativeBalanceException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.exception.UnAuthorizedException;
import com.backend.wealth_tracker.mapper.ExpenseMapper;
import com.backend.wealth_tracker.service.ExpenseService;
import com.backend.wealth_tracker.service.ExpenseStatisticsService;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
  @Tag(name = "FIND")
  public List<ResponseExpenseDTO> getExpensesInRange(
      @RequestParam String startDate, @RequestParam String endDate) {
    return ExpenseMapper.expensesToResponseExpenseDTOs(
        this.expenseService.getExpensesInRange(startDate, endDate));
  }

  @GetMapping("/by-category-and-created-at")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = "FIND")
  public List<ResponseCategoryExpenseDTO> getExpensesByCategoryAndCreatedAt(
      @RequestParam String startDate, @RequestParam String endDate) {
    return this.expenseStatisticsService.getExpensesByCategoryAndCreatedAt(startDate, endDate);
  }

  @GetMapping("/by-tag-and-created-at")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = "FIND")
  public List<ResponseTagExpenseDTO> getExpensesByTagAndCreatedAt(
      @RequestParam String startDate, @RequestParam String endDate) {
    return this.expenseStatisticsService.getExpensesByTagAndCreatedAt(startDate, endDate);
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
