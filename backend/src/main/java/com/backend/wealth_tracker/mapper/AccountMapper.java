package com.backend.wealth_tracker.mapper;

import com.backend.wealth_tracker.dto.request_dto.CreateAccountDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseAccountDTO;
import com.backend.wealth_tracker.model.Account;
import com.backend.wealth_tracker.model.Profile;
import com.backend.wealth_tracker.model.User;
import java.util.Comparator;
import java.util.List;

public final class AccountMapper {

  private AccountMapper() {}

  public static Account createAccountDTOToAccount(
      CreateAccountDTO createAccountDTO, User user, Profile profile) {
    Account account = new Account();
    account.setAccountName(createAccountDTO.getAccountName());
    account.setAccountType(createAccountDTO.getAccountType());
    account.setAccountDescription(createAccountDTO.getAccountDescription());
    account.setAccountBalance(createAccountDTO.getAccountBalance());
    account.setUser(user);
    account.setProfile(profile);
    return account;
  }

  public static ResponseAccountDTO accountToResponseAccountDTO(Account account) {
    ResponseAccountDTO responseAccountDTO = new ResponseAccountDTO();
    responseAccountDTO.setAccountId(account.getAccountId());
    responseAccountDTO.setAccountName(account.getAccountName());
    responseAccountDTO.setAccountDescription(account.getAccountDescription());
    responseAccountDTO.setAccountBalance(account.getAccountBalance());
    responseAccountDTO.setAccountType(account.getAccountType());
    responseAccountDTO.setProfileId(account.getProfile().getProfileId());
    return responseAccountDTO;
  }

  public static List<ResponseAccountDTO> accountsToResponseAccountDTOs(List<Account> accounts) {
    return accounts.parallelStream()
        .map(AccountMapper::accountToResponseAccountDTO)
        .sorted(Comparator.comparing(ResponseAccountDTO::getAccountName))
        .toList();
  }
}
