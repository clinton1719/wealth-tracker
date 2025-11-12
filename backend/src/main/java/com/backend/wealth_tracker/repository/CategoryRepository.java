package com.backend.wealth_tracker.repository;

import com.backend.wealth_tracker.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    public List<Category> findAllCategoriesByUserId(Long userId);
}
