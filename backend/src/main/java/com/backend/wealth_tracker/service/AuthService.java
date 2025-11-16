package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.dto.SignUpDto;
import com.backend.wealth_tracker.enums.AccountType;
import com.backend.wealth_tracker.exception.ResourceAlreadyExistsException;
import com.backend.wealth_tracker.exception.ResourceNotFoundException;
import com.backend.wealth_tracker.model.Account;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.AccountRepository;
import com.backend.wealth_tracker.repository.CategoryRepository;
import com.backend.wealth_tracker.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class AuthService implements UserDetailsService {
    private final Logger LOGGER = LoggerFactory.getLogger(AuthService.class);
    private final UserRepository repository;
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;
    @Value("${default.category.name}")
    private String DEFAULT_CATEGORY_NAME;
    @Value("${default.account.name}")
    private String DEFAULT_ACCOUNT_NAME;

    public AuthService(UserRepository repository, CategoryRepository categoryRepository, AccountRepository accountRepository) {
        this.repository = repository;
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) {
        return repository.findByUsername(username);
    }

    public void signUp(SignUpDto signUpDto) throws ResourceAlreadyExistsException {
        if (repository.findByUsername(signUpDto.getUsername()) != null) {
            throw new ResourceAlreadyExistsException("Username already exists for name: " + signUpDto.getUsername());
        }
        String encryptedPassword = new BCryptPasswordEncoder().encode(signUpDto.getPassword());
        User newUser = new User(signUpDto.getUsername(), encryptedPassword, signUpDto.getRole());
        saveDefaults(newUser);
        LOGGER.info("New user registered: {}", newUser.getUsername());
        repository.save(newUser);
    }

    public User getUserByUsername(String username) throws ResourceNotFoundException {
        User user = (User) repository.findByUsername(username);
        if (user != null) {
            return user;
        } else {
            throw new ResourceNotFoundException("User not found with username: " + username);
        }
    }

    public void saveDefaults(User newUser) {
        Category defaultCategory = new Category();
        defaultCategory.setUser(newUser);
        defaultCategory.setCategoryName(DEFAULT_CATEGORY_NAME);
        defaultCategory.setDescription("This is your default category. Unassigned items will be seen here.");
        defaultCategory.setColorCode("#000000");
        defaultCategory.setTags(List.of("default"));
        this.categoryRepository.save(defaultCategory);

        Account account = new Account();
        account.setAccountType(AccountType.SAVINGS);
        account.setAccountName(DEFAULT_ACCOUNT_NAME);
        account.setAccountBalance(BigDecimal.ZERO);
        account.setUser(newUser);
        account.setDescription("This is your default account. You will not be able to delete this account");
        this.accountRepository.save(account);
    }
}
