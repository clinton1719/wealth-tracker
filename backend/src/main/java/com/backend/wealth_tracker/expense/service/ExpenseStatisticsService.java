package com.backend.wealth_tracker.expense.service;

import com.backend.wealth_tracker.projections.expense.CategoryExpenseSummaryProjection;
import com.backend.wealth_tracker.projections.expense.CategoryMonthlyExpenseProjection;
import com.backend.wealth_tracker.projections.expense.TagExpenseSummaryProjection;
import com.backend.wealth_tracker.projections.expense.TagMonthlyExpenseProjection;
import com.backend.wealth_tracker.expense.repository.ExpenseRepository;
import java.time.LocalDate;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

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

  @Transactional(
      isolation = Isolation.READ_COMMITTED,
      propagation = Propagation.REQUIRED,
      readOnly = true)
  public List<TagMonthlyExpenseProjection> getMonthlyExpensesByTag(
      String startDate, String endDate) {
    LocalDate start = LocalDate.parse(startDate);
    LocalDate end = LocalDate.parse(endDate);
    List<TagMonthlyExpenseProjection> tagMonthlyExpenseProjectionList =
        expenseRepository.findMonthlyExpensesByTag(start, end);
    LOGGER.atInfo().log(
        "Found {} expenses between {} and {} for getMonthlyExpensesByTag",
        tagMonthlyExpenseProjectionList.size(),
        startDate,
        endDate);
    return tagMonthlyExpenseProjectionList;
  }
}
