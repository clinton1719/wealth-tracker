package com.backend.wealth_tracker.repository;

import com.backend.wealth_tracker.model.Profile;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
  Optional<Profile> findByProfileNameAndId(String profileName, Long id);

  List<Profile> findAllByUserId(Long userId);
}
