package com.backend.wealth_tracker.category.repository;

import com.backend.wealth_tracker.category.model.Category;
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
             SELECT DISTINCT c FROM categories c
             LEFT JOIN FETCH c.categoryTags
             WHERE c.user.id = :userId
            """)
  List<Category> findAllWithRelations(@Param("userId") Long userId);

  Optional<Category> findByCategoryNameAndUserId(String categoryName, Long userId);

  Optional<Category> findByCategoryIdAndUserId(Long categoryId, Long userId);
}
