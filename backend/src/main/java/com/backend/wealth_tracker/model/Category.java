package com.backend.wealth_tracker.model;

import jakarta.persistence.*;
import java.io.Serial;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity(name = "categories")
@SuppressWarnings("PMD.DataClass")
public class Category implements Serializable {

  @Serial private static final long serialVersionUID = 1L;

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long categoryId;

  @Column(nullable = false)
  private String categoryName;

  private String categoryDescription;

  @Column(nullable = false)
  private String categoryColorCode;

  @Column(name = "categoryIcon")
  private String categoryIcon;

  @ElementCollection
  @CollectionTable(name = "category_tags", joinColumns = @JoinColumn(name = "category_id"))
  @Column(name = "tag")
  private List<String> categoryTags;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @OneToMany(mappedBy = "category")
  private Set<Expense> expenses = new HashSet<>();

  @ManyToOne
  @JoinColumn(name = "profile_id")
  private Profile profile;

  public Category() {}

  public Category(Category originalCategory) {
    this.categoryId = originalCategory.categoryId;
    this.categoryName = originalCategory.categoryName;
    this.categoryDescription = originalCategory.categoryDescription;
    this.categoryColorCode = originalCategory.categoryColorCode;
    this.categoryIcon = originalCategory.categoryIcon;
    this.categoryTags = originalCategory.categoryTags;
    this.user = originalCategory.user;
    this.expenses = originalCategory.expenses;
    this.profile = originalCategory.profile;
  }

  public Long getCategoryId() {
    return categoryId;
  }

  public void setCategoryId(Long categoryId) {
    this.categoryId = categoryId;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public void setCategoryName(String categoryName) {
    this.categoryName = categoryName;
  }

  public String getCategoryDescription() {
    return categoryDescription;
  }

  public void setCategoryDescription(String categoryDescription) {
    this.categoryDescription = categoryDescription;
  }

  public String getCategoryColorCode() {
    return categoryColorCode;
  }

  public void setCategoryColorCode(String categoryColorCode) {
    this.categoryColorCode = categoryColorCode;
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
      throw new IllegalArgumentException("User cannot be null for category");
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

  public String getCategoryIcon() {
    return categoryIcon;
  }

  public void setCategoryIcon(String categoryIcon) {
    this.categoryIcon = categoryIcon;
  }

  public List<String> getCategoryTags() {
    if (categoryTags == null) {
      return List.of();
    }
    return new ArrayList<>(categoryTags);
  }

  public void setCategoryTags(List<String> categoryTags) {
    if (this.categoryTags == null) {
      this.categoryTags = new ArrayList<>();
    }
    if (categoryTags != null) {
      this.categoryTags.clear();
      this.categoryTags.addAll(categoryTags);
    } else {
      this.categoryTags.clear();
    }
  }

  public Profile getProfile() {
    if (profile == null) {
      return null;
    }
    return new Profile(profile);
  }

  public void setProfile(Profile profile) {
    if (profile != null) {
      this.profile = new Profile(profile);
    } else {
      throw new IllegalArgumentException("Profile cannot be null for category");
    }
  }

  @Override
  public String toString() {
    return "Category{"
        + "categoryId="
        + categoryId
        + ", categoryName='"
        + categoryName
        + '\''
        + ", categoryDescription='"
        + categoryDescription
        + '\''
        + ", categoryColorCode='"
        + categoryColorCode
        + '\''
        + ", categoryIcon='"
        + categoryIcon
        + '\''
        + ", categoryTags="
        + categoryTags
        + ", user="
        + user
        + ", profile="
        + profile
        + '}';
  }
}
