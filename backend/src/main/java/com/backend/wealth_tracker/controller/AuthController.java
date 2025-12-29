package com.backend.wealth_tracker.controller;

import com.backend.wealth_tracker.config.TokenProvider;
import com.backend.wealth_tracker.dto.JwtDto;
import com.backend.wealth_tracker.dto.LogInDto;
import com.backend.wealth_tracker.dto.SignUpDto;
import com.backend.wealth_tracker.enums.UserRole;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.service.AuthService;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Auth", description = "API methods to manipulate Auth data")
public class AuthController {

  private final AuthenticationManager authenticationManager;

  private final AuthService service;

  private final TokenProvider tokenService;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public AuthController(
      AuthenticationManager authenticationManager,
      AuthService service,
      TokenProvider tokenService) {
    this.authenticationManager = authenticationManager;
    this.service = service;
    this.tokenService = tokenService;
  }

  @PostMapping("/signup")
  public ResponseEntity<?> signUp(@RequestBody @Valid SignUpDto data)
      throws ResourceAlreadyExistsException {
    data.setRole(UserRole.USER);
    service.signUp(data);
    return ResponseEntity.status(HttpStatus.CREATED).build();
  }

  @PostMapping("/login")
  public ResponseEntity<JwtDto> login(@RequestBody @Valid LogInDto logInDto) {
    UsernamePasswordAuthenticationToken usernamePassword =
        new UsernamePasswordAuthenticationToken(logInDto.getUsername(), logInDto.getPassword());
    var principal = extractPrincipal(usernamePassword);
    var accessToken = tokenService.generateAccessToken((User) principal);
    return ResponseEntity.ok(new JwtDto(accessToken));
  }

  private Object extractPrincipal(UsernamePasswordAuthenticationToken usernamePassword) {
    var authUser = authenticationManager.authenticate(usernamePassword);
    return authUser.getPrincipal();
  }
}
