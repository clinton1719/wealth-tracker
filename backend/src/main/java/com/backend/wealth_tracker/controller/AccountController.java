package com.backend.wealth_tracker.controller;

import com.backend.wealth_tracker.dto.request_dto.CreateAccountDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseAccountDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateAccountDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.mapper.AccountMapper;
import com.backend.wealth_tracker.service.AccountService;
import jakarta.validation.Valid;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/accounts")
public class AccountController {

  private final Logger LOGGER = LoggerFactory.getLogger(AccountController.class);

  private final AccountService accountService;

  public AccountController(AccountService accountService) {
    this.accountService = accountService;
  }

  @GetMapping("/all")
  @ResponseStatus(HttpStatus.OK)
  public List<ResponseAccountDTO> getAllAccounts(@AuthenticationPrincipal UserDetails userDetails)
      throws ResourceNotFoundException {
    try {
      return AccountMapper.accountsToResponseAccountDTOs(
          this.accountService.getAllAccounts(userDetails.getUsername()));
    } catch (Exception e) {
      LOGGER.error("Failed to get all accounts!", e);
      throw e;
    }
  }

  @PostMapping("/save")
  @ResponseStatus(HttpStatus.CREATED)
  public ResponseAccountDTO saveAccount(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody CreateAccountDTO createAccountDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    try {
      return AccountMapper.accountToResponseAccountDTO(
          this.accountService.saveAccount(createAccountDTO, userDetails.getUsername()));
    } catch (Exception e) {
      LOGGER.error("Failed to save account!", e);
      throw e;
    }
  }

  @PutMapping("/update")
  @ResponseStatus(HttpStatus.OK)
  public ResponseAccountDTO updateAccount(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody UpdateAccountDTO updateAccountDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    try {
      return AccountMapper.accountToResponseAccountDTO(
          this.accountService.updateAccount(updateAccountDTO, userDetails.getUsername()));
    } catch (Exception e) {
      LOGGER.error("Failed to update account!", e);
      throw e;
    }
  }

  @DeleteMapping("/delete/{id}")
  @ResponseStatus(HttpStatus.OK)
  public void deleteCategory(@PathVariable Long id) throws ResourceNotFoundException {
    try {
      this.accountService.deleteAccount(id);
    } catch (Exception e) {
      LOGGER.error("Failed to delete account!", e);
      throw e;
    }
  }
}
