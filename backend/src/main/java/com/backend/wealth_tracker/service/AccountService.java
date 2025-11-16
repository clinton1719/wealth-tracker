package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.request_dto.CreateAccountDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateAccountDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.mapper.AccountMapper;
import com.backend.wealth_tracker.model.Account;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class AccountService {
    private final Logger LOGGER = LoggerFactory.getLogger(AccountService.class);
    private final AccountRepository accountRepository;
    private final AuthService authService;
    private final ExpenseService expenseService;
    @Value("${default.account.name}")
    private String DEFAULT_ACCOUNT_NAME;


    AccountService(AccountRepository accountRepository, AuthService authService, ExpenseService expenseService) {
        this.accountRepository = accountRepository;
        this.authService = authService;
        this.expenseService = expenseService;
    }

    public List<Account> getAllAccounts(String userName) throws ResourceNotFoundException {
        User user = this.authService.getUserByUsername(userName);
        List<Account> accountList = this.accountRepository.findByUserId(user.getId());
        LOGGER.info("Fetched {} categories for user: {}", accountList.size(), userName);
        return accountList;
    }

    public Account saveAccount(CreateAccountDTO createAccountDTO, String userName) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        User user = this.authService.getUserByUsername(userName);
        Optional<Account> similarAccount = this.accountRepository.findByAccountNameAndUserId(createAccountDTO.getAccountName(), user.getId());
        if (similarAccount.isPresent()) {
            throw new ResourceAlreadyExistsException("Account already present with name: " + similarAccount.get().getAccountName() + " for user: " + user.getId());
        }
        Account account = AccountMapper.createAccountDTOToAccount(createAccountDTO, user);
        Account savedAccount = this.accountRepository.save(account);
        LOGGER.info("Account to be saved created with id: {}", savedAccount.getId());
        return savedAccount;
    }

    public Account updateAccount(UpdateAccountDTO updateAccountDTO, String userName) throws ResourceNotFoundException, ResourceAlreadyExistsException {
        User user = this.authService.getUserByUsername(userName);
        Optional<Account> accountOptional = this.accountRepository.findById(updateAccountDTO.getId());
        if (accountOptional.isEmpty()) {
            LOGGER.error("Account to be updated not found with id: {}", updateAccountDTO.getId());
            throw new ResourceNotFoundException("Account not found");
        }
        if (!accountOptional.get().getAccountName().equals(accountOptional.get().getAccountName())) {
            Optional<Account> similarAccount = this.accountRepository.findByAccountNameAndUserId(updateAccountDTO.getAccountName(), user.getId());
            if (similarAccount.isPresent()) {
                throw new ResourceAlreadyExistsException("Category already present with name: " + updateAccountDTO.getAccountName() + " for user: " + user.getId());
            }
        }
        Account account = updateAccountValues(updateAccountDTO, accountOptional.get());
        Account updatedAccount = this.accountRepository.save(account);
        LOGGER.info("Category updated with id: {}", updatedAccount.getId());
        return updatedAccount;
    }

    public void deleteAccount(Long id, String userName) throws ResourceNotFoundException {
        User user = this.authService.getUserByUsername(userName);
        Optional<Account> accountOptional = this.accountRepository.findById(id);
        if (accountOptional.isEmpty()) {
            LOGGER.error("Account to be deleted not found with id: {}", id);
            throw new ResourceNotFoundException("Account not found");
        }
        Account account = accountOptional.get();
        Optional<Account> defaultAccountOptional = this.accountRepository.findByAccountNameAndUserId(DEFAULT_ACCOUNT_NAME, id);
        if (defaultAccountOptional.isEmpty()) {
            LOGGER.error("Default account not found with id: {}", id);
            throw new RuntimeException("Default account not found");
        }
        if (Objects.equals(account.getId(), defaultAccountOptional.get().getId())) {
            throw new RuntimeException("Default account cannot be deleted");
        }
        this.expenseService.updateAccountInExpenses(account, defaultAccountOptional.get(), user);
        this.accountRepository.delete(account);
        LOGGER.info("Account deleted with id: {}", id);
    }

    public Account updateAccountValues(UpdateAccountDTO updateAccountDTO, Account account) {
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
