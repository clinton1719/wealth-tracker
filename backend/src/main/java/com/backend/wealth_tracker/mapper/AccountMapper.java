package com.backend.wealth_tracker.mapper;

import com.backend.wealth_tracker.dto.request_dto.CreateAccountDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseAccountDTO;
import com.backend.wealth_tracker.model.Account;
import com.backend.wealth_tracker.model.User;

import java.util.List;

public class AccountMapper {

    public static Account createAccountDTOToAccount(CreateAccountDTO createAccountDTO, User user) {
        Account account  = new Account();
        account.setAccountName(createAccountDTO.getAccountName());
        account.setAccountType(createAccountDTO.getAccountType());
        account.setDescription(createAccountDTO.getDescription());
        account.setAccountBalance(createAccountDTO.getAccountBalance());
        account.setUser(user);
        return account;
    }

    public static ResponseAccountDTO accountToResponseAccountDTO(Account account) {
        ResponseAccountDTO responseAccountDTO = new ResponseAccountDTO();
        responseAccountDTO.setId(account.getId());
        responseAccountDTO.setAccountName(account.getAccountName());
        responseAccountDTO.setDescription(account.getDescription());
        responseAccountDTO.setAccountBalance(account.getAccountBalance());
        responseAccountDTO.setAccountType(account.getAccountType());
        return responseAccountDTO;
    }

    public static List<ResponseAccountDTO> accountsToResponseAccountDTOs(List<Account> accounts) {
        return accounts.stream()
                .map(AccountMapper::accountToResponseAccountDTO)
                .toList();
    }
}
