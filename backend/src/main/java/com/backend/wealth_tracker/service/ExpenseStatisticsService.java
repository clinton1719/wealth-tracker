package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.response_dto.ResponseCategoryExpenseDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseTagExpenseDTO;
import com.backend.wealth_tracker.projections.CategoryExpenseSummaryProjection;
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
    public List<ResponseCategoryExpenseDTO> getExpensesByCategoryAndCreatedAt(
            String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<CategoryExpenseSummaryProjection> responseCategoryExpenseDTOList =
                expenseRepository.findByCategoryAndCreatedAt(start, end);
        LOGGER.atInfo().log(
                "Found {} expenses between {} and {} for getExpensesByCategoryAndCreatedAt",
                responseCategoryExpenseDTOList.size(),
                startDate,
                endDate);
        return responseCategoryExpenseDTOList.stream()
                .map(
                        projection ->
                                new ResponseCategoryExpenseDTO(
                                        projection.getCategoryName(),
                                        projection.getCategoryColorCode(),
                                        projection.getCategoryIcon(),
                                        projection.getExpenseAmount(),
                                        projection.getProfileId(),
                                        projection.getProfileColorCode()))
                .toList();
    }

    @Transactional(
            isolation = Isolation.READ_COMMITTED,
            propagation = Propagation.REQUIRED,
            readOnly = true)
    public List<ResponseTagExpenseDTO> getExpensesByTagAndCreatedAt(
            String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);
        List<TagExpenseSummaryProjection> responseTagExpenseDTOList =
                expenseRepository.findByTagAndCreatedAt(start, end);
        LOGGER.atInfo().log(
                "Found {} expenses between {} and {} for getExpensesByTagAndCreatedAt",
                responseTagExpenseDTOList.size(),
                startDate,
                endDate);
        return responseTagExpenseDTOList.stream()
                .map(
                        projection ->
                                new ResponseTagExpenseDTO(
                                        projection.getTag(),
                                        projection.getExpenseAmount(),
                                        projection.getProfileId(),
                                        projection.getProfileColorCode()))
                .toList();
    }
}
