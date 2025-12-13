package com.backend.wealth_tracker.repository;

import com.backend.wealth_tracker.model.Expense;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
  @Query(
      """
              SELECT e FROM expenses e
              LEFT JOIN FETCH e.category
              LEFT JOIN FETCH e.account
              LEFT JOIN FETCH e.profile
              WHERE e.expenseCreatedAt BETWEEN :startDate AND :endDate
              ORDER BY e.expenseCreatedAt DESC
            """)
  List<Expense> findByCreatedAtBetweenOrderDesc(LocalDate startDate, LocalDate endDate);

  @Query(
      """
                    SELECT e FROM expenses e
                    LEFT JOIN FETCH e.category
                    LEFT JOIN FETCH e.account
                    LEFT JOIN FETCH e.profile
                    WHERE e.expenseCreatedAt BETWEEN :startDate AND :endDate
                  """)
  List<Expense> findByCreatedAtBetween(LocalDate startDate, LocalDate endDate);
}
