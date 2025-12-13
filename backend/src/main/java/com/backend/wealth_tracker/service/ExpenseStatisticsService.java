package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.model.Expense;
import com.backend.wealth_tracker.repository.ExpenseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenseStatisticsService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ExpenseStatisticsService.class);

    private final ExpenseRepository expenseRepository;

    public ExpenseStatisticsService(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Transactional(
            isolation = Isolation.READ_COMMITTED,
            propagation = Propagation.REQUIRED,
            readOnly = true)
    public void getExpensesByCategoryAndCreatedAt(UserDetails userDetails,
                                                  String startDate,
                                                  String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<Expense> expenses = expenseRepository.findByCreatedAtBetween(start, end);
        LOGGER.atInfo().log("Found {} expenses between {} and {}", expenses.size(), startDate, endDate);
//        return expenses;
    }
}
