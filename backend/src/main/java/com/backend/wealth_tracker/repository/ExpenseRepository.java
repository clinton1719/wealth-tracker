package com.backend.wealth_tracker.repository;

import com.backend.wealth_tracker.model.Expense;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    @Query("SELECT e FROM expenses e " +
            "LEFT JOIN FETCH e.category " +
            "LEFT JOIN FETCH e.account " +
            "LEFT JOIN FETCH e.profile " +
            "WHERE e.createdAt BETWEEN :startDate AND :endDate")
    List<Expense> findByCreatedAtBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
}
