package com.backend.wealth_tracker.enums;

public enum AccountType {
    SAVINGS("savings"),
    CURRENT("current");

    private final String accountType;

    AccountType (String accountType) {
        this.accountType = accountType;
    }

    public String getAccountType() {
        return this.accountType;
    }
}
