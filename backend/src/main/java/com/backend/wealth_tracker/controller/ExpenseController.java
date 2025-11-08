package com.backend.wealth_tracker.controller;

import com.backend.wealth_tracker.dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.ResponseExpenseDTO;
import com.backend.wealth_tracker.dto.UpdateExpenseDTO;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/expense")
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping(path = "/{id}")
    public ResponseExpenseDTO getExpense(@PathVariable Long id) throws ResourceNotFoundException {
        return expenseService.getExpense(id);
    }

    @PostMapping(path = "/save")
    public ResponseExpenseDTO saveExpense(@Valid @RequestBody CreateExpenseDTO createExpenseDTO) {
        return expenseService.saveExpense(createExpenseDTO);
    }

    @PutMapping(path = "/update")
    public ResponseExpenseDTO updateExpense(@Valid @RequestBody UpdateExpenseDTO updateExpenseDTO) throws ResourceNotFoundException {
        return expenseService.updateExpense(updateExpenseDTO);
    }

    @DeleteMapping(path = "/delete/{id}")
    public ResponseEntity<String> updateExpense(@PathVariable Long id) throws ResourceNotFoundException {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok(String.format("Expense %d deleted successfully", id));
    }
}
