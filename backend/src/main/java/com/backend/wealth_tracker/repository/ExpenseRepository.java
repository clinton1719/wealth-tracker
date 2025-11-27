package com.backend.wealth_tracker.repository;

import com.backend.wealth_tracker.model.Expense;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
  List<Expense> findByCreatedAtBetween(LocalDate startDate, LocalDate endDate, Pageable pageable);

  List<Expense> findByCategoryId(Long categoryId);

  List<Expense> findByAccountId(Long accountId);
}
