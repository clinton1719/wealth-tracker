package com.backend.wealth_tracker.auth.service;

import com.backend.wealth_tracker.dto.SignUpDto;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.auth.model.User;
import com.backend.wealth_tracker.auth.repository.UserRepository;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import javax.annotation.Nonnull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService implements UserDetailsService {
  private static final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);
  private final UserRepository userRepository;

  @SuppressFBWarnings("EI_EXPOSE_REP2")
  public AuthService(UserRepository repository) {
    this.userRepository = repository;
  }

  @Override
  public @Nonnull UserDetails loadUserByUsername(@Nonnull String username) {
    return userRepository.findByUsername(username);
  }

  @Transactional(isolation = Isolation.SERIALIZABLE, propagation = Propagation.REQUIRED)
  public void signUp(SignUpDto signUpDto) throws ResourceAlreadyExistsException {
    if (userRepository.findByUsername(signUpDto.getUsername()) != null) {
      throw new ResourceAlreadyExistsException(
          "Username already exists for name: " + signUpDto.getUsername());
    }
    String encryptedPassword = new BCryptPasswordEncoder().encode(signUpDto.getPassword());
    User newUser = new User(signUpDto.getUsername(), encryptedPassword, signUpDto.getRole());
    User savedUser = userRepository.save(newUser);
    LOGGER.atInfo().log("New user registered: {}", savedUser.getUsername());
  }

  @Transactional(isolation = Isolation.READ_COMMITTED, propagation = Propagation.REQUIRED)
  public User getUserByUsername(String username) throws ResourceNotFoundException {
    User user = (User) userRepository.findByUsername(username);
    if (user != null) {
      return user;
    } else {
      throw new ResourceNotFoundException("User not found with username: " + username);
    }
  }
}
