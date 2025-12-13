package com.backend.wealth_tracker.repository;

import com.backend.wealth_tracker.model.Category;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
  @Query(
      """
             SELECT c FROM categories c
             LEFT JOIN FETCH c.expenses
             WHERE c.user.id = :userId
            """)
  List<Category> findAllWithRelations(@Param("userId") Long userId);

  Optional<Category> findByCategoryNameAndUserId(String categoryName, Long userId);

  Optional<Category> findByCategoryIdAndUserId(Long categoryId, Long userId);
}
