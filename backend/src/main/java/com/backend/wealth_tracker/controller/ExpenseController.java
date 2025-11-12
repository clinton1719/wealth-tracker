package com.backend.wealth_tracker.controller;

import com.backend.wealth_tracker.dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.ResponseExpenseDTO;
import com.backend.wealth_tracker.dto.UpdateExpenseDTO;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.mapper.ExpenseMapper;
import com.backend.wealth_tracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping("/range/{pageNumber}/{pageSize}")
    @ResponseStatus(HttpStatus.OK)
    public List<ResponseExpenseDTO> getExpensesInRange(@AuthenticationPrincipal UserDetails userDetails, @RequestParam String startDate, @RequestParam String endDate, @PathVariable Integer pageNumber, @PathVariable Integer pageSize) {
        return ExpenseMapper.expensesToResponseExpenseDTOs(expenseService.getExpensesInRange(userDetails, startDate, endDate, pageNumber, pageSize));
    }

    @PostMapping(path = "/save")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseExpenseDTO saveExpense(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody CreateExpenseDTO createExpenseDTO) throws ResourceNotFoundException {
        return ExpenseMapper.expenseToResponseExpenseDTO(expenseService.saveExpense(createExpenseDTO, userDetails.getUsername()));
    }

    @PutMapping(path = "/update")
    @ResponseStatus(HttpStatus.OK)
    public ResponseExpenseDTO updateExpense(@Valid @RequestBody UpdateExpenseDTO updateExpenseDTO) throws ResourceNotFoundException {
        return ExpenseMapper.expenseToResponseExpenseDTO(expenseService.updateExpense(updateExpenseDTO));
    }

    @DeleteMapping(path = "/delete/{id}")
    @ResponseStatus(HttpStatus.OK)
    public String updateExpense(@PathVariable Long id) throws ResourceNotFoundException {
        expenseService.deleteExpense(id);
        return String.format("Expense %d deleted successfully", id);
    }
}
