package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.request_dto.CreateAccountDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateAccountDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.exception.UnAuthorizedException;
import com.backend.wealth_tracker.helper.Helper;
import com.backend.wealth_tracker.mapper.AccountMapper;
import com.backend.wealth_tracker.model.Account;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.AccountRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class AccountService {
    private final Logger LOGGER = LoggerFactory.getLogger(AccountService.class);
    private final AccountRepository accountRepository;
    private final AuthService authService;

    @SuppressFBWarnings("EI_EXPOSE_REP2")
    public AccountService(AccountRepository accountRepository, AuthService authService) {
        this.accountRepository = accountRepository;
        this.authService = authService;
    }

    @Transactional(isolation = Isolation.READ_UNCOMMITTED, propagation = Propagation.REQUIRED, readOnly = true)
    public List<Account> getAllAccounts(String userName) throws ResourceNotFoundException {
        User user = this.authService.getUserByUsername(userName);
        List<Account> accountList = this.accountRepository.findAllWithRelations(user.getId());
        LOGGER.atInfo().log("Fetched {} accounts for user: {}", accountList.size(), userName);
        return accountList;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
    public Account saveAccount(CreateAccountDTO createAccountDTO, String userName) throws ResourceNotFoundException, ResourceAlreadyExistsException, UnAuthorizedException {
        User user = this.authService.getUserByUsername(userName);
        if (!Helper.isProfileIdValid(user.getProfiles(), createAccountDTO.getProfileId())) {
            LOGGER.atError().log("Account to be saved had illegal profile ID: {}", createAccountDTO.getProfileId());
            throw new UnAuthorizedException("Illegal profile id in account");
        }
        Optional<Account> similarAccount = this.accountRepository.findByAccountNameAndUserId(createAccountDTO.getAccountName(), user.getId());
        if (similarAccount.isPresent()) {
            throw new ResourceAlreadyExistsException("Account already present with name: " + similarAccount.get().getAccountName() + " for user: " + user.getId());
        }
        Account account = AccountMapper.createAccountDTOToAccount(createAccountDTO, user);
        Account savedAccount = this.accountRepository.save(account);
        LOGGER.atInfo().log("Account to be saved created : {}", savedAccount);
        return savedAccount;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
    public Account updateAccount(UpdateAccountDTO updateAccountDTO, String userName) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        User user = this.authService.getUserByUsername(userName);
        Optional<Account> accountOptional = this.accountRepository.findByIdAndUserId(updateAccountDTO.getId(), user.getId());
        if (accountOptional.isEmpty()) {
            LOGGER.atError().log("Account to be updated not found : {}", updateAccountDTO);
            throw new ResourceNotFoundException("Account not found");
        }
        if (!accountOptional.get().getAccountName().equals(accountOptional.get().getAccountName())) {
            Optional<Account> similarAccount = this.accountRepository.findByAccountNameAndUserId(updateAccountDTO.getAccountName(), user.getId());
            if (similarAccount.isPresent()) {
                throw new ResourceAlreadyExistsException("Account already present with name: " + updateAccountDTO.getAccountName() + " for user: " + user.getId());
            }
        }
        Account account = updateAccountValues(updateAccountDTO, accountOptional.get(), user.getId());
        Account updatedAccount = this.accountRepository.save(account);
        LOGGER.atInfo().log("Account updated : {}", updatedAccount);
        return updatedAccount;
    }

    @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
    public void deleteAccount(Long id, String userName) throws ResourceNotFoundException {
        User user = this.authService.getUserByUsername(userName);
        Optional<Account> accountOptional = this.accountRepository.findByIdAndUserId(id, user.getId());
        if (accountOptional.isEmpty()) {
            LOGGER.atError().log("Account to be deleted not found with id: {}", id);
            throw new ResourceNotFoundException("Account not found");
        }
        Account account = accountOptional.get();
        this.accountRepository.delete(account);
        LOGGER.atInfo().log("Account deleted with id: {}", id);
    }

    public Account updateAccountValues(UpdateAccountDTO updateAccountDTO, Account account, Long userId) {
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
        return account;
    }
}
