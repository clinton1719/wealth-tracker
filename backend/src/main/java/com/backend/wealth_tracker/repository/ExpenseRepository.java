package com.backend.wealth_tracker.repository;

import com.backend.wealth_tracker.model.Expense;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByCreatedAtBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);
}
