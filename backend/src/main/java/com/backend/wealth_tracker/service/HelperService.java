package com.backend.wealth_tracker.service;

import com.backend.wealth_tracker.enums.AccountType;
import com.backend.wealth_tracker.model.Account;
import com.backend.wealth_tracker.model.Category;
import com.backend.wealth_tracker.model.Profile;
import com.backend.wealth_tracker.model.User;
import com.backend.wealth_tracker.repository.AccountRepository;
import com.backend.wealth_tracker.repository.CategoryRepository;
import com.backend.wealth_tracker.repository.ProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class HelperService {
    private final Logger LOGGER = LoggerFactory.getLogger(HelperService.class);
    private final CategoryRepository categoryRepository;
    private final AccountRepository accountRepository;
    private final ProfileRepository profileRepository;
    @Value("${default.category.name}")
    private String DEFAULT_CATEGORY_NAME;
    @Value("${default.account.name}")
    private String DEFAULT_ACCOUNT_NAME;
    @Value("${default.profile.name}")
    private String DEFAULT_PROFILE_NAME;

    HelperService(CategoryRepository categoryRepository, AccountRepository accountRepository, ProfileRepository profileRepository) {
        this.categoryRepository = categoryRepository;
        this.accountRepository = accountRepository;
        this.profileRepository = profileRepository;
    }

    public void saveDefaults(User savedUser) {
        saveDefaultCategory(savedUser);

        saveDefaultAccount(savedUser);

        saveDefaultProfile(savedUser);
    }

    private void saveDefaultProfile(User savedUser) {
        Profile profile = new Profile();
        profile.setProfileName(DEFAULT_PROFILE_NAME);
        profile.setDescription("This is your default profile. You may edit this to your liking.");
        profile.setColorCode("#000000");
        profile.setUser(savedUser);
        this.profileRepository.save(profile);
        LOGGER.info("Default profile saved with id: {}", profile.getId());
    }

    private void saveDefaultAccount(User savedUser) {
        Account account = new Account();
        account.setAccountType(AccountType.SAVINGS);
        account.setAccountName(DEFAULT_ACCOUNT_NAME);
        account.setAccountBalance(BigDecimal.ZERO);
        account.setUser(savedUser);
        account.setDescription("This is your default account. You will not be able to delete this account as at least one account is mandatory");
        this.accountRepository.save(account);
        LOGGER.info("Default account saved with id: {}", account.getId());
    }

    private void saveDefaultCategory(User savedUser) {
        Category defaultCategory = new Category();
        defaultCategory.setUser(savedUser);
        defaultCategory.setCategoryName(DEFAULT_CATEGORY_NAME);
        defaultCategory.setDescription("This is your default category. Unassigned items will be attached to this category such as when you delete a category which is already assigned to several expenses. This category will not appear on reports or other data.");
        defaultCategory.setColorCode("#000000");
        defaultCategory.setTags(List.of("default"));
        this.categoryRepository.save(defaultCategory);
        LOGGER.info("Default category saved with id: {}", defaultCategory.getId());
    }
}
