package com.backend.wealth_tracker.enums;

public enum AccountType {
  SAVINGS("savings"),
  CURRENT("current");

  private final String type;

  AccountType(String type) {
    this.type = type;
  }

  public String getType() {
    return this.type;
  }
}
