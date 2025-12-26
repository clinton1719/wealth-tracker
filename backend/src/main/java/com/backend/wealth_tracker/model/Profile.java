package com.backend.wealth_tracker.model;

import jakarta.persistence.*;
import java.io.Serial;
import java.io.Serializable;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "profiles")
public class Profile implements Serializable {

  @Serial private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long profileId;

  @Column(nullable = false)
  private String profileName;

  private String profileDescription;

  @Column(nullable = false)
  private String profileColorCode;

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
    this.profileId = originalProfile.profileId;
    this.profileName = originalProfile.profileName;
    this.profileDescription = originalProfile.profileDescription;
    this.profileColorCode = originalProfile.profileColorCode;
    this.profilePicture = originalProfile.profilePicture;
    this.profilePictureExtension = originalProfile.profilePictureExtension;
    this.user = originalProfile.user;
    this.accounts = originalProfile.accounts;
    this.categories = originalProfile.categories;
    this.expenses = originalProfile.expenses;
  }

  public Long getProfileId() {
    return profileId;
  }

  public void setProfileId(Long profileId) {
    this.profileId = profileId;
  }

  public String getProfileName() {
    return profileName;
  }

  public void setProfileName(String profileName) {
    this.profileName = profileName;
  }

  public String getProfileColorCode() {
    return profileColorCode;
  }

  public void setProfileColorCode(String profileColorCode) {
    this.profileColorCode = profileColorCode;
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

  public String getProfileDescription() {
    return profileDescription;
  }

  public void setProfileDescription(String profileDescription) {
    this.profileDescription = profileDescription;
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
        + profileId
        + ", profileName='"
        + profileName
        + '\''
        + ", description='"
        + profileDescription
        + '\''
        + ", colorCode='"
        + profileColorCode
        + '\''
        + ", profilePictureExtension='"
        + profilePictureExtension
        + '\''
        + ", user="
        + user
        + '}';
  }
}
