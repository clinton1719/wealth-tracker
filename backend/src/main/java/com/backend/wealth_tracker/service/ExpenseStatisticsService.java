package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.response_dto.ResponseCategoryExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseTagExpenseDTO;
import com.backend.wealth_tracker.mapper.ExpenseMapper;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.Expense;
import com.backend.wealth_tracker.repository.ExpenseRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
  public List<ResponseCategoryExpenseDTO> getExpensesByCategoryAndCreatedAt(
      String startDate, String endDate) {
    LocalDate start = LocalDate.parse(startDate);
    LocalDate end = LocalDate.parse(endDate);
    List<Expense> expenses = expenseRepository.findByCreatedAtBetween(start, end);
    LOGGER.atInfo().log(
        "Found {} expenses between {} and {} for getExpensesByCategoryAndCreatedAt",
        expenses.size(),
        startDate,
        endDate);
    Map<Long, BigDecimal> categoryExpenseMap = new HashMap<>();
    Map<Long, Category> categoryMap = new HashMap<>();
    expenses.forEach(
        expense -> {
          Category category = expense.getCategory();
          Long categoryId = category.getCategoryId();
          categoryExpenseMap.merge(categoryId, expense.getExpenseAmount(), BigDecimal::add);
          categoryMap.putIfAbsent(categoryId, category);
        });
    return ExpenseMapper.createResponseCategoryExpenseDTOFromMaps(categoryExpenseMap, categoryMap);
  }

  @Transactional(
      isolation = Isolation.READ_COMMITTED,
      propagation = Propagation.REQUIRED,
      readOnly = true)
  public List<ResponseTagExpenseDTO> getExpensesByTagAndCreatedAt(
      String startDate, String endDate) {
    LocalDate start = LocalDate.parse(startDate);
    LocalDate end = LocalDate.parse(endDate);
    List<Expense> expenses = expenseRepository.findByCreatedAtBetween(start, end);
    LOGGER.atInfo().log(
        "Found {} expenses between {} and {} for getExpensesByTagAndCreatedAt",
        expenses.size(),
        startDate,
        endDate);
    Map<String, BigDecimal> tagMap = new HashMap<>();
    expenses.forEach(
        expense -> {
          Category category = expense.getCategory();
          List<String> tags = category.getCategoryTags();
          for (String tag : tags) {
            tagMap.merge(tag, expense.getExpenseAmount(), BigDecimal::add);
          }
        });
    return ExpenseMapper.createResponseTagExpenseDTOFromMaps(tagMap);
  }
}
