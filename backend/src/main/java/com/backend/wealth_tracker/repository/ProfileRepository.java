package com.backend.wealth_tracker.repository;

import com.backend.wealth_tracker.model.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
  Optional<Profile> findByProfileNameAndUserId(String profileName, Long userId);

  @Query(
      "SELECT p FROM profiles p "
          + "LEFT JOIN FETCH p.accounts "
          + "LEFT JOIN FETCH p.categories "
          + "LEFT JOIN FETCH p.expenses "
          + "WHERE p.user.id = :userId")
  List<Profile> findAllWithRelations(@Param("userId") Long userId);
  Optional<Profile> findByIdAndUserId(Long id, Long userId);
}
