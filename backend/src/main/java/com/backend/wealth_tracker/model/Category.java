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
  private Long id;

  @Column(nullable = false)
  private String categoryName;

  private String description;

  @Column(nullable = false)
  private String colorCode;

  @Column private String icon;
  @Column private List<String> tags;

  @ManyToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "user_id")
  private User user;

  @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
  private Set<Expense> expenses = new HashSet<>();

  @ManyToOne(cascade = CascadeType.ALL)
  @JoinColumn(name = "profile_id")
  private Profile profile;

  public Category() {}

  public Category(Category originalCategory) {
    this.id = originalCategory.id;
    this.categoryName = originalCategory.categoryName;
    this.description = originalCategory.description;
    this.colorCode = originalCategory.colorCode;
    this.icon = originalCategory.icon;
    this.tags = originalCategory.tags;
    this.user = originalCategory.user;
    this.expenses = originalCategory.expenses;
    this.profile = originalCategory.profile;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getCategoryName() {
    return categoryName;
  }

  public void setCategoryName(String categoryName) {
    this.categoryName = categoryName;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getColorCode() {
    return colorCode;
  }

  public void setColorCode(String colorCode) {
    this.colorCode = colorCode;
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

  public String getIcon() {
    return icon;
  }

  public void setIcon(String icon) {
    this.icon = icon;
  }

  public List<String> getTags() {
    if (tags == null) {
      return List.of();
    }
    return new ArrayList<>(tags);
  }

  public void setTags(List<String> tags) {
    if (this.tags == null) {
      this.tags = new ArrayList<>();
    }
    if (tags != null) {
      this.tags.clear();
      this.tags.addAll(tags);
    } else {
      this.tags.clear();
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
        return "Category{" +
                "id=" + id +
                ", categoryName='" + categoryName + '\'' +
                ", description='" + description + '\'' +
                ", colorCode='" + colorCode + '\'' +
                ", icon='" + icon + '\'' +
                ", tags=" + tags +
                ", user=" + user +
                ", expenses=" + expenses +
                ", profile=" + profile +
                '}';
    }
}
