package com.backend.wealth_tracker.controller;

import com.backend.wealth_tracker.dto.request_dto.CreateExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseExpenseDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateExpenseDTO;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.mapper.ExpenseMapper;
import com.backend.wealth_tracker.service.ExpenseService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/expenses")
public class ExpenseController {
    private final Logger LOGGER = LoggerFactory.getLogger(ExpenseController.class);

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping("/range/{pageNumber}/{pageSize}")
    @ResponseStatus(HttpStatus.OK)
    public List<ResponseExpenseDTO> getExpensesInRange(@AuthenticationPrincipal UserDetails userDetails, @RequestParam String startDate, @RequestParam String endDate, @PathVariable Integer pageNumber, @PathVariable Integer pageSize) {
        try {
            return ExpenseMapper.expensesToResponseExpenseDTOs(this.expenseService.getExpensesInRange(userDetails, startDate, endDate, pageNumber, pageSize));
        } catch (Exception e) {
            LOGGER.error("Failed to get all expenses!", e);
            throw e;
        }

    }

    @PostMapping(path = "/save")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseExpenseDTO saveExpense(@AuthenticationPrincipal UserDetails userDetails, @Valid @RequestBody CreateExpenseDTO createExpenseDTO) throws ResourceNotFoundException {
        try {
            return ExpenseMapper.expenseToResponseExpenseDTO(this.expenseService.saveExpense(createExpenseDTO, userDetails.getUsername()));
        } catch (Exception e) {
            LOGGER.error("Failed to save expense!", e);
            throw e;
        }

    }

    @PutMapping(path = "/update")
    @ResponseStatus(HttpStatus.OK)
    public ResponseExpenseDTO updateExpense(@Valid @RequestBody UpdateExpenseDTO updateExpenseDTO) throws ResourceNotFoundException {
        try {
            return ExpenseMapper.expenseToResponseExpenseDTO(this.expenseService.updateExpense(updateExpenseDTO));
        } catch (Exception e) {
            LOGGER.error("Failed to update expense!", e);
            throw e;
        }

    }

    @DeleteMapping(path = "/delete/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateExpense(@PathVariable Long id) throws ResourceNotFoundException {
        try {
            this.expenseService.deleteExpense(id);
        } catch (Exception e) {
            LOGGER.error("Failed to delete expense!", e);
            throw e;
        }
    }
}
