package com.backend.wealth_tracker.controller;

import com.backend.wealth_tracker.dto.request_dto.CreateAccountDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseAccountDTO;
import com.backend.wealth_tracker.dto.update_dto.UpdateAccountDTO;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.exception.UnAuthorizedException;
import com.backend.wealth_tracker.mapper.AccountMapper;
import com.backend.wealth_tracker.service.AccountService;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.backend.wealth_tracker.helper.Constants.*;

@RestController
@RequestMapping(value = "/api/v1/accounts")
@Tag(name = "Account", description = "API methods to manipulate Account data")
public class AccountController {

  private final AccountService accountService;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public AccountController(AccountService accountService) {
    this.accountService = accountService;
  }

  @GetMapping("/all")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = READ_CALL_TAG)
  public List<ResponseAccountDTO> getAllAccounts(@AuthenticationPrincipal UserDetails userDetails)
      throws ResourceNotFoundException {
    return AccountMapper.accountsToResponseAccountDTOs(
        this.accountService.getAllAccounts(userDetails.getUsername()));
  }

  @PostMapping("/save")
  @ResponseStatus(HttpStatus.CREATED)
  @Tag(name = CREATE_CALL_TAG)
  public ResponseAccountDTO saveAccount(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody CreateAccountDTO createAccountDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException, UnAuthorizedException {
    return AccountMapper.accountToResponseAccountDTO(
        this.accountService.saveAccount(createAccountDTO, userDetails.getUsername()));
  }

  @PutMapping("/update")
  @ResponseStatus(HttpStatus.OK)
  @Tag(name = UPDATE_CALL_TAG)
  public ResponseAccountDTO updateAccount(
      @AuthenticationPrincipal UserDetails userDetails,
      @Valid @RequestBody final UpdateAccountDTO updateAccountDTO)
      throws ResourceNotFoundException, ResourceAlreadyExistsException {
    return AccountMapper.accountToResponseAccountDTO(
        this.accountService.updateAccount(updateAccountDTO, userDetails.getUsername()));
  }

  @DeleteMapping("/delete/{id}")
  @Tag(name = DELETE_CALL_TAG)
  @ResponseStatus(HttpStatus.OK)
  public void deleteCategory(
      @AuthenticationPrincipal UserDetails userDetails, @PathVariable Long id)
      throws ResourceNotFoundException {
    this.accountService.deleteAccount(id, userDetails.getUsername());
  }
}
