package com.backend.wealth_tracker.controller;

import com.backend.wealth_tracker.config.TokenProvider;
import com.backend.wealth_tracker.dto.JwtDto;
import com.backend.wealth_tracker.dto.LogInDto;
import com.backend.wealth_tracker.dto.SignUpDto;
import com.backend.wealth_tracker.exception.InvalidJwtException;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.service.AuthService;
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
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final AuthService service;

    private final TokenProvider tokenService;

    public AuthController(AuthenticationManager authenticationManager,
                          AuthService service,
                          TokenProvider tokenService) {
        this.authenticationManager = authenticationManager;
        this.service = service;
        this.tokenService = tokenService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody @Valid SignUpDto data) throws InvalidJwtException {
        service.signUp(data);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/login")
    public ResponseEntity<JwtDto> login(@RequestBody @Valid LogInDto logInDto) throws InterruptedException {
        var usernamePassword = new UsernamePasswordAuthenticationToken(logInDto.getUsername(), logInDto.getPassword());
        var authUser = authenticationManager.authenticate(usernamePassword);
        var accessToken = tokenService.generateAccessToken((User) authUser.getPrincipal());
        return ResponseEntity.ok(new JwtDto(accessToken));
    }
}