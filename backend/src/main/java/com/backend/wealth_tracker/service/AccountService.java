package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.request_dto.CreateAccountDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateAccountDTO;
import com.backend.wealth_tracker.exception.AccountCannotHaveNegativeBalanceException;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.exception.UnAuthorizedException;
import com.backend.wealth_tracker.helper.Helper;
import com.backend.wealth_tracker.mapper.AccountMapper;
import com.backend.wealth_tracker.model.Account;
import com.backend.wealth_tracker.model.Profile;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.AccountRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AccountService {
  private static final Logger LOGGER = LoggerFactory.getLogger(AccountService.class);
  private final AccountRepository accountRepository;
  private final AuthService authService;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public AccountService(AccountRepository accountRepository, AuthService authService) {
    this.accountRepository = accountRepository;
    this.authService = authService;
  }

  @Transactional(
      isolation = Isolation.READ_UNCOMMITTED,
      propagation = Propagation.REQUIRED,
      readOnly = true)
  public List<Account> getAllAccounts(String userName) throws ResourceNotFoundException {
    User user = authService.getUserByUsername(userName);
    List<Account> accountList = accountRepository.findAllWithRelations(user.getId());
    LOGGER.atInfo().log("Fetched {} accounts for user: {}", accountList.size(), userName);
    return accountList;
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public Account saveAccount(CreateAccountDTO createAccountDTO, String userName)
      throws ResourceNotFoundException, ResourceAlreadyExistsException, UnAuthorizedException {
    User user = authService.getUserByUsername(userName);
    if (!Helper.isProfileIdValid(user.getProfiles(), createAccountDTO.getProfileId())) {
      LOGGER
          .atError()
          .log("Account to be saved had illegal profile ID: {}", createAccountDTO.getProfileId());
      throw new UnAuthorizedException("Illegal profile id in account");
    }
    Optional<Account> similarAccount =
        accountRepository.findByAccountNameAndUserId(
            createAccountDTO.getAccountName(), user.getId());
    if (similarAccount.isPresent()) {
      throw new ResourceAlreadyExistsException(
          "Account already present with name: "
              + similarAccount.get().getAccountName()
              + " for user: "
              + user.getId());
    }
    Profile profile =
        user.getProfiles().parallelStream()
            .filter(p -> Objects.equals(p.getProfileId(), createAccountDTO.getProfileId()))
            .findFirst()
            .orElseThrow(
                () -> {
                  LOGGER
                      .atError()
                      .log("Profile id not found while saving account: {}", createAccountDTO);
                  return new ResourceNotFoundException("Profile id not found while saving account");
                });
    Account account = AccountMapper.createAccountDTOToAccount(createAccountDTO, user, profile);
    Account savedAccount = accountRepository.save(account);
    LOGGER.atInfo().log("Account to be saved created : {}", savedAccount);
    return savedAccount;
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public Account updateAccount(UpdateAccountDTO updateAccountDTO, String userName)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    User user = authService.getUserByUsername(userName);
    Optional<Account> accountOptional =
        accountRepository.findByAccountIdAndUserId(updateAccountDTO.getAccountId(), user.getId());
    if (accountOptional.isEmpty()) {
      LOGGER.atError().log("Account to be updated not found : {}", updateAccountDTO);
      throw new ResourceNotFoundException("Account not found");
    }
    if (!accountOptional.get().getAccountName().equals(accountOptional.get().getAccountName())) {
      Optional<Account> similarAccount =
          accountRepository.findByAccountNameAndUserId(
              updateAccountDTO.getAccountName(), user.getId());
      if (similarAccount.isPresent()) {
        throw new ResourceAlreadyExistsException(
            "Account already present with name: "
                + updateAccountDTO.getAccountName()
                + " for user: "
                + user.getId());
      }
    }
    Account account = updateAccountValues(updateAccountDTO, accountOptional.get(), user.getId());
    Account updatedAccount = accountRepository.save(account);
    LOGGER.atInfo().log("Account updated : {}", updatedAccount);
    return updatedAccount;
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public void deleteAccount(Long id, String userName) throws ResourceNotFoundException {
    User user = authService.getUserByUsername(userName);
    Optional<Account> accountOptional =
        accountRepository.findByAccountIdAndUserId(id, user.getId());
    if (accountOptional.isEmpty()) {
      LOGGER.atError().log("Account to be deleted not found with id: {}", id);
      throw new ResourceNotFoundException("Account not found");
    }
    Account account = accountOptional.get();
    accountRepository.delete(account);
    LOGGER.atInfo().log("Account deleted with id: {}", id);
  }

  public Account updateAccountValues(
      UpdateAccountDTO updateAccountDTO, Account account, Long userId) {
    if (updateAccountDTO.getAccountName() != null) {
      account.setAccountName(updateAccountDTO.getAccountName());
    }
    if (updateAccountDTO.getAccountDescription() != null) {
      account.setAccountDescription(updateAccountDTO.getAccountDescription());
    }
    if (updateAccountDTO.getAccountType() != null) {
      account.setAccountType(updateAccountDTO.getAccountType());
    }
    return account;
  }

  public void debitAccount(Long accountId, BigDecimal debitAmount)
      throws ResourceNotFoundException, AccountCannotHaveNegativeBalanceException {
    Account account =
        accountRepository
            .findById(accountId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Account not found for id: " + accountId));
    BigDecimal accountBalance = account.getAccountBalance();
    if (accountBalance.compareTo(BigDecimal.ONE) < 0) {
      LOGGER
          .atError()
          .log(
              "Account balance: {} found to be negative for account: {}",
              accountBalance,
              accountId);
      throw new AccountCannotHaveNegativeBalanceException();
    }
    account.setAccountBalance(accountBalance.subtract(debitAmount));
    Account savedAccount = accountRepository.save(account);
    LOGGER.atInfo().log("Account debited: {} with: {}", savedAccount, debitAmount);
  }

  public void creditAccount(Long accountId, BigDecimal creditAmount)
      throws ResourceNotFoundException {
    Account account =
        accountRepository
            .findById(accountId)
            .orElseThrow(
                () -> new ResourceNotFoundException("Account not found for id: " + accountId));
    BigDecimal accountBalance = account.getAccountBalance();
    account.setAccountBalance(accountBalance.add(creditAmount));
    Account savedAccount = accountRepository.save(account);
    LOGGER.atInfo().log("Account credited: {} with: {}", savedAccount, creditAmount);
  }
}
