package com.backend.wealth_tracker.repository;

import com.backend.wealth_tracker.model.Category;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
  List<Category> findAllCategoriesByUserId(Long userId);

  Optional<Category> findByCategoryNameAndUserId(String categoryName, Long id);
}
