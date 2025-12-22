package com.backend.wealth_tracker.repository;

import com.backend.wealth_tracker.model.Expense;
import com.backend.wealth_tracker.projections.*;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
  @Query(
      """
              SELECT
                e.expenseId AS expenseId,
                e.expenseDescription AS expenseDescription,
                e.expenseAmount AS expenseAmount,
                e.category.categoryId AS categoryId,
                e.account.accountId AS accountId,
                e.profile.profileId AS profileId,
                e.expenseCreatedAt AS expenseCreatedAt,
                e.expenseUpdatedAt AS expenseUpdatedAt
              FROM expenses e
              WHERE e.expenseCreatedAt BETWEEN :startDate AND :endDate
              ORDER BY e.expenseCreatedAt DESC
            """)
  List<ExpenseSummaryProjection> findExpenseSummaryBetween(LocalDate startDate, LocalDate endDate);

  @Query(
      """
            SELECT
                e.expenseDescription AS expenseDescription,
                e.expenseAmount      AS expenseAmount,
                c.categoryName       AS categoryName,
                a.accountName        AS accountName,
                p.profileName        AS profileName,
                e.expenseCreatedAt   AS expenseCreatedAt
              FROM expenses e
                JOIN e.category c
                JOIN e.profile p
                JOIN e.account a
              WHERE e.expenseCreatedAt BETWEEN :startDate AND :endDate
              ORDER BY e.expenseCreatedAt ASC
            """)
  List<ExpenseReportSummaryProjection> findExpenseReportSummaryBetween(
      LocalDate startDate, LocalDate endDate);

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

  @Query(
      value =
          """
                SELECT
                    c.category_name         AS categoryName,
                    c.category_color_code   AS categoryColorCode,
                    date_trunc('month', e.expense_created_at) AS month,
                    p.profile_id           AS profileId,
                    SUM(e.expense_amount)   AS expenseAmount
                FROM expenses e
                JOIN categories c ON e.category_id = c.category_id
                JOIN profiles p ON c.profile_id = p.profile_id
                WHERE e.expense_created_at BETWEEN :startDate AND :endDate
                GROUP BY
                    c.category_name,
                    c.category_color_code,
                    date_trunc('month', e.expense_created_at),
                    p.profile_id
                ORDER BY
                    month ASC
            """,
      nativeQuery = true)
  List<CategoryMonthlyExpenseProjection> findMonthlyExpensesByCategory(
      LocalDate startDate, LocalDate endDate);

  @Query(
      value =
          """
                SELECT
                    ct.tag                AS tag,
                    date_trunc('month', e.expense_created_at) AS month,
                    p.profile_id           AS profileId,
                    SUM(e.expense_amount)   AS expenseAmount
                FROM expenses e
                JOIN categories c ON e.category_id = c.category_id
                JOIN category_tags ct ON ct.category_id = c.category_id
                JOIN profiles p ON c.profile_id = p.profile_id
                WHERE e.expense_created_at BETWEEN :startDate AND :endDate
                GROUP BY
                    ct.tag,
                    date_trunc('month', e.expense_created_at),
                    p.profile_id
                ORDER BY
                    month ASC
            """,
      nativeQuery = true)
  List<TagMonthlyExpenseProjection> findMonthlyExpensesByTag(
      LocalDate startDate, LocalDate endDate);
}
