package com.backend.wealth_tracker.repository;

import com.backend.wealth_tracker.model.Account;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
  @Query("SELECT a FROM accounts a " + "LEFT JOIN FETCH a.expenses " + "WHERE a.user.id = :userId")
  List<Account> findAllWithRelations(@Param("userId") Long userId);

  Optional<Account> findByAccountNameAndUserId(String accountName, Long userId);

  Optional<Account> findByAccountIdAndUserId(Long accountId, Long userId);
}
