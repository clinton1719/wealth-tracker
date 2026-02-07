package com.backend.wealth_tracker.profile.repository;

import com.backend.wealth_tracker.profile.model.Profile;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
  Optional<Profile> findByProfileNameAndUserId(String profileName, Long userId);

  @Query(
      """
            SELECT p FROM profiles p
            WHERE p.user.id = :userId
            """)
  List<Profile> findAllWithRelations(@Param("userId") Long userId);

  Optional<Profile> findByProfileIdAndUserId(Long profileId, Long userId);
}
