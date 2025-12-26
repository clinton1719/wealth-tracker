package com.backend.wealth_tracker.model;

import com.backend.wealth_tracker.enums.UserRole;
import jakarta.persistence.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Serial;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity(name = "users")
public class User implements UserDetails {
  @Serial private static final long serialVersionUID = 1L;
  private static final String mappedBy = "user";

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String username;
  private String password;

  @Enumerated(EnumType.STRING)
  private UserRole role;

  @OneToMany(mappedBy = mappedBy, orphanRemoval = true)
  private Set<Expense> expenses = new HashSet<>();

  @OneToMany(mappedBy = mappedBy, orphanRemoval = true)
  private Set<Category> categories = new HashSet<>();

  @OneToMany(mappedBy = mappedBy, orphanRemoval = true)
  private Set<Account> accounts = new HashSet<>();

  @OneToMany(mappedBy = mappedBy, orphanRemoval = true)
  private Set<Profile> profiles = new HashSet<>();

  public User(User originalUser) {
    this.id = originalUser.id;
    this.username = originalUser.username;
    this.password = originalUser.password;
    this.role = originalUser.role;
    this.expenses = originalUser.expenses;
    this.categories = originalUser.categories;
    this.accounts = originalUser.accounts;
    this.profiles = originalUser.profiles;
  }

  public User(String username, String password, UserRole role) {
    this.username = username;
    this.password = password;
    this.role = role;
  }

  public User() {}

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    if (this.role == UserRole.ADMIN) {
      return List.of(
          new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
    }
    return List.of(new SimpleGrantedAuthority("ROLE_USER"));
  }

  @Override
  public String getPassword() {
    return password;
  }

  @Override
  public String getUsername() {
    return username;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public UserRole getRole() {
    return role;
  }

  public void setRole(UserRole role) {
    this.role = role;
  }

  public Set<Expense> getExpenses() {
    if (expenses == null) {
      return Set.of();
    }
    return new HashSet<>(expenses);
  }

  public void setExpenses(Set<Expense> expenses) {
    if (this.expenses == null) {
      this.expenses = new HashSet<>();
    }
    if (expenses != null) {
      this.expenses.clear();
      this.expenses.addAll(expenses);
    } else {
      this.expenses.clear();
    }
  }

  public Set<Category> getCategories() {
    if (categories == null) {
      return Set.of();
    }
    return new HashSet<>(categories);
  }

  public void setCategories(Set<Category> categories) {
    if (this.categories == null) {
      this.categories = new HashSet<>();
    }
    if (categories != null) {
      this.categories.clear();
      this.categories.addAll(categories);
    } else {
      this.categories.clear();
    }
  }

  public Set<Account> getAccounts() {
    if (accounts == null) {
      return Set.of();
    }
    return new HashSet<>(accounts);
  }

  public void setAccounts(Set<Account> accounts) {
    if (this.accounts == null) {
      this.accounts = new HashSet<>();
    }
    if (accounts != null) {
      this.accounts.clear();
      this.accounts.addAll(accounts);
    } else {
      this.accounts.clear();
    }
  }

  public Set<Profile> getProfiles() {
    return Set.copyOf(profiles);
  }

  public void setProfiles(Set<Profile> profiles) {
    if (profiles != null) {
      this.profiles = new HashSet<>(profiles);
    } else {
      this.profiles = Set.of();
    }
  }
}
