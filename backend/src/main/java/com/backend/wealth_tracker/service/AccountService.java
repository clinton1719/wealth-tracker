package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.request_dto.CreateAccountDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateAccountDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.mapper.AccountMapper;
import com.backend.wealth_tracker.model.Account;
import com.backend.wealth_tracker.model.Profile;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.AccountRepository;
import com.backend.wealth_tracker.repository.ProfileRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AccountService {
  private final Logger LOGGER = LoggerFactory.getLogger(AccountService.class);
  private final AccountRepository accountRepository;
  private final AuthService authService;
  private final ProfileRepository profileRepository;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public AccountService(
      AccountRepository accountRepository,
      AuthService authService,
      ProfileRepository profileRepository) {
    this.accountRepository = accountRepository;
    this.authService = authService;
    this.profileRepository = profileRepository;
  }

  public List<Account> getAllAccounts(String userName) throws ResourceNotFoundException {
    User user = this.authService.getUserByUsername(userName);
    List<Account> accountList = this.accountRepository.findByUserId(user.getId());
    LOGGER.atInfo().log("Fetched {} categories for user: {}", accountList.size(), userName);
    return accountList;
  }

  public Account saveAccount(CreateAccountDTO createAccountDTO, String userName)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    User user = this.authService.getUserByUsername(userName);
    Optional<Account> similarAccount =
        this.accountRepository.findByAccountNameAndUserId(
            createAccountDTO.getAccountName(), user.getId());
    if (similarAccount.isPresent()) {
      throw new ResourceAlreadyExistsException(
          "Account already present with name: "
              + similarAccount.get().getAccountName()
              + " for user: "
              + user.getId());
    }
    Account account = AccountMapper.createAccountDTOToAccount(createAccountDTO, user);
    Account savedAccount = this.accountRepository.save(account);
    LOGGER.atInfo().log("Account to be saved created with id: {}", savedAccount.getId());
    return savedAccount;
  }

  public Account updateAccount(UpdateAccountDTO updateAccountDTO, String userName)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    User user = this.authService.getUserByUsername(userName);
    Optional<Account> accountOptional = this.accountRepository.findById(updateAccountDTO.getId());
    if (accountOptional.isEmpty()) {
      LOGGER.atError().log("Account to be updated not found with id: {}", updateAccountDTO.getId());
      throw new ResourceNotFoundException("Account not found");
    }
    if (!accountOptional.get().getAccountName().equals(accountOptional.get().getAccountName())) {
      Optional<Account> similarAccount =
          this.accountRepository.findByAccountNameAndUserId(
              updateAccountDTO.getAccountName(), user.getId());
      if (similarAccount.isPresent()) {
        throw new ResourceAlreadyExistsException(
            "Category already present with name: "
                + updateAccountDTO.getAccountName()
                + " for user: "
                + user.getId());
      }
    }
    Account account = updateAccountValues(updateAccountDTO, accountOptional.get());
    Account updatedAccount = this.accountRepository.save(account);
    LOGGER.atInfo().log("Category updated with id: {}", updatedAccount.getId());
    return updatedAccount;
  }

  public void deleteAccount(Long id) throws ResourceNotFoundException {
    Optional<Account> accountOptional = this.accountRepository.findById(id);
    if (accountOptional.isEmpty()) {
      LOGGER.atError().log("Account to be deleted not found with id: {}", id);
      throw new ResourceNotFoundException("Account not found");
    }
    Account account = accountOptional.get();
    this.accountRepository.delete(account);
    LOGGER.atInfo().log("Account deleted with id: {}", id);
  }

  public Account updateAccountValues(UpdateAccountDTO updateAccountDTO, Account account)
      throws ResourceNotFoundException {
    if (updateAccountDTO.getAccountName() != null) {
      account.setAccountName(updateAccountDTO.getAccountName());
    }
    if (updateAccountDTO.getDescription() != null) {
      account.setDescription(updateAccountDTO.getDescription());
    }
    if (updateAccountDTO.getAccountType() != null) {
      account.setAccountType(updateAccountDTO.getAccountType());
    }
    if (updateAccountDTO.getAccountBalance() != null) {
      account.setAccountBalance(updateAccountDTO.getAccountBalance());
    }
    if (updateAccountDTO.getProfileId() != null) {
      Optional<Profile> optionalProfile =
          this.profileRepository.findById(updateAccountDTO.getProfileId());
      if (optionalProfile.isEmpty()) {
        throw new ResourceNotFoundException(
            "Profile not found for ID: " + updateAccountDTO.getProfileId());
      }
      account.setProfile(optionalProfile.get());
    }
    return account;
  }
}
