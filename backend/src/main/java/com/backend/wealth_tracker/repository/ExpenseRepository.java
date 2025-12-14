package com.backend.wealth_tracker.repository;

import com.backend.wealth_tracker.model.Expense;
import com.backend.wealth_tracker.projections.CategoryExpenseSummaryProjection;
import com.backend.wealth_tracker.projections.TagExpenseSummaryProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

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
      value =
          """
                SELECT
                    c.category_name        AS categoryName,
                    c.category_color_code  AS categoryColorCode,
                    c.category_icon        AS categoryIcon,
                    p.profile_id           AS profileId,
                    p.profile_color_code   AS profileColorCode,
                    SUM(e.expense_amount)  AS expenseAmount
                FROM expenses e
                JOIN categories c ON e.category_id = c.category_id
                JOIN profiles p ON c.profile_id = p.profile_id
                WHERE e.expense_created_at BETWEEN :startDate AND :endDate
                GROUP BY
                    c.category_name,
                    c.category_color_code,
                    c.category_icon,
                    p.profile_id,
                    p.profile_color_code;
            """,
      nativeQuery = true)
  List<CategoryExpenseSummaryProjection> findByCategoryAndCreatedAt(
      LocalDate startDate, LocalDate endDate);

  @Query(
      value =
          """
        SELECT
            ct.tag                AS tag,
            p.profile_id           AS profileId,
            p.profile_color_code   AS profileColorCode,
            SUM(e.expense_amount) AS expenseAmount
        FROM expenses e
        JOIN categories c ON e.category_id = c.category_id
        JOIN category_tags ct ON ct.category_id = c.category_id
        JOIN profiles p ON c.profile_id = p.profile_id
        WHERE e.expense_created_at BETWEEN :startDate AND :endDate
        GROUP BY ct.tag, c.profile_id, p.profile_id
    """,
      nativeQuery = true)
  List<TagExpenseSummaryProjection> findByTagAndCreatedAt(LocalDate startDate, LocalDate endDate);
}
