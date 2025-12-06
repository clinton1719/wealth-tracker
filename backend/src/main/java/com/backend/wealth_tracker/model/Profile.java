package com.backend.wealth_tracker.model;

import jakarta.persistence.*;
import java.io.Serial;
import java.io.Serializable;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "profiles")
@SuppressWarnings("PMD.DataClass")
public class Profile implements Serializable {

  @Serial private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private String profileName;

  private String description;

  @Column(nullable = false)
  private String colorCode;

  @Column(columnDefinition = "bytea")
  private byte[] profilePicture;

  @Column private String profilePictureExtension;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @OneToMany(mappedBy = "profile", orphanRemoval = true)
  private Set<Account> accounts;

  @OneToMany(mappedBy = "profile", orphanRemoval = true)
  private Set<Category> categories;

  @OneToMany(mappedBy = "profile", orphanRemoval = true)
  private Set<Expense> expenses;

  public Profile() {}

  public Profile(Profile originalProfile) {
    this.id = originalProfile.id;
    this.profileName = originalProfile.profileName;
    this.description = originalProfile.description;
    this.colorCode = originalProfile.colorCode;
    this.profilePicture = originalProfile.profilePicture;
    this.profilePictureExtension = originalProfile.profilePictureExtension;
    this.user = originalProfile.user;
    this.accounts = originalProfile.accounts;
    this.categories = originalProfile.categories;
    this.expenses = originalProfile.expenses;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getProfileName() {
    return profileName;
  }

  public void setProfileName(String profileName) {
    this.profileName = profileName;
  }

  public String getColorCode() {
    return colorCode;
  }

  public void setColorCode(String colorCode) {
    this.colorCode = colorCode;
  }

  public byte[] getProfilePicture() {
    if (profilePicture == null) {
      return new byte[] {};
    }
    return Arrays.copyOf(profilePicture, profilePicture.length);
  }

  public void setProfilePicture(byte[] profilePicture) {
    if (this.profilePicture == null) {
      this.profilePicture = new byte[] {};
    }
    if (profilePicture != null) {
      this.profilePicture = Arrays.copyOf(profilePicture, profilePicture.length);
    } else {
      Arrays.fill(this.profilePicture, (byte) 0);
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

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public User getUser() {
    if (user == null) {
      return null;
    }
    return new User(user);
  }

  public void setUser(User user) {
    if (user != null) {
      this.user = new User(user);
    } else {
      throw new IllegalArgumentException("User cannot be null for profile");
    }
  }

  public String getProfilePictureExtension() {
    return profilePictureExtension;
  }

  public void setProfilePictureExtension(String profilePictureExtension) {
    this.profilePictureExtension = profilePictureExtension;
  }

  @Override
  public String toString() {
    return "Profile{"
        + "id="
        + id
        + ", profileName='"
        + profileName
        + '\''
        + ", description='"
        + description
        + '\''
        + ", colorCode='"
        + colorCode
        + '\''
        + ", profilePicture="
        + Arrays.toString(profilePicture)
        + ", profilePictureExtension='"
        + profilePictureExtension
        + '\''
        + ", user="
        + user
        + ", accounts="
        + accounts
        + ", categories="
        + categories
        + ", expenses="
        + expenses
        + '}';
  }
}
