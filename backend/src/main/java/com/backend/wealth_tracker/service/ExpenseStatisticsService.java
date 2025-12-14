package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.projections.CategoryExpenseSummaryProjection;
import com.backend.wealth_tracker.projections.CategoryMonthlyExpenseProjection;
import com.backend.wealth_tracker.projections.TagExpenseSummaryProjection;
import com.backend.wealth_tracker.repository.ExpenseRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
  public List<CategoryExpenseSummaryProjection> getExpensesByCategoryAndCreatedAt(
      String startDate, String endDate) {
    LocalDate start = LocalDate.parse(startDate);
    LocalDate end = LocalDate.parse(endDate);
    List<CategoryExpenseSummaryProjection> categoryExpenseSummaryProjectionList =
        expenseRepository.findByCategoryAndCreatedAt(start, end);
    LOGGER.atInfo().log(
        "Found {} expenses between {} and {} for getExpensesByCategoryAndCreatedAt",
        categoryExpenseSummaryProjectionList.size(),
        startDate,
        endDate);
    return categoryExpenseSummaryProjectionList;
  }

  @Transactional(
      isolation = Isolation.READ_COMMITTED,
      propagation = Propagation.REQUIRED,
      readOnly = true)
  public List<TagExpenseSummaryProjection> getExpensesByTagAndCreatedAt(
      String startDate, String endDate) {
    LocalDate start = LocalDate.parse(startDate);
    LocalDate end = LocalDate.parse(endDate);
    List<TagExpenseSummaryProjection> tagExpenseSummaryProjectionList =
        expenseRepository.findByTagAndCreatedAt(start, end);
    LOGGER.atInfo().log(
        "Found {} expenses between {} and {} for getExpensesByTagAndCreatedAt",
        tagExpenseSummaryProjectionList.size(),
        startDate,
        endDate);
    return tagExpenseSummaryProjectionList;
  }

    @Transactional(
            isolation = Isolation.READ_COMMITTED,
            propagation = Propagation.REQUIRED,
            readOnly = true)
    public List<CategoryMonthlyExpenseProjection> getMonthlyExpensesByCategory(
            String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<CategoryMonthlyExpenseProjection> categoryMonthlyExpenseProjectionList =
                expenseRepository.findMonthlyExpensesByCategory(start, end);
        LOGGER.atInfo().log(
                "Found {} expenses between {} and {} for getMonthlyExpensesByCategory",
                categoryMonthlyExpenseProjectionList.size(),
                startDate,
                endDate);
        return categoryMonthlyExpenseProjectionList;
    }
}
