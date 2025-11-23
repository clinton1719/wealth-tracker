package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.SignUpDto;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService implements UserDetailsService {
  private final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);
  private final UserRepository userRepository;

  public AuthService(UserRepository repository) {
    this.userRepository = repository;
  }

  @Override
  public UserDetails loadUserByUsername(String username) {
    return userRepository.findByUsername(username);
  }

  public void signUp(SignUpDto signUpDto) throws ResourceAlreadyExistsException {
    if (userRepository.findByUsername(signUpDto.getUsername()) != null) {
      throw new ResourceAlreadyExistsException(
          "Username already exists for name: " + signUpDto.getUsername());
    }
    String encryptedPassword = new BCryptPasswordEncoder().encode(signUpDto.getPassword());
    User newUser = new User(signUpDto.getUsername(), encryptedPassword, signUpDto.getRole());
    User savedUser = userRepository.save(newUser);
    LOGGER.info("New user registered: {}", savedUser.getUsername());
  }

  public User getUserByUsername(String username) throws ResourceNotFoundException {
    User user = (User) userRepository.findByUsername(username);
    if (user != null) {
      return user;
    } else {
      throw new ResourceNotFoundException("User not found with username: " + username);
    }
  }
}
