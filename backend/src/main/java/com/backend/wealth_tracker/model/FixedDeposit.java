package com.backend.wealth_tracker.model;

import java.math.BigDecimal;

public class FixedDeposit {
    Long fixedDepositId;
    String fixedDepositName;
    BigDecimal fixedDepositPrincipal;
    BigDecimal fixedDepositInterestRate;
    String fixedDepositTenure;
    Long accountId;
    Long profileId;
    String fixedDepositStartDate;

    public Long getFixedDepositId() {
        return fixedDepositId;
    }

    public void setFixedDepositId(Long fixedDepositId) {
        this.fixedDepositId = fixedDepositId;
    }

    public String getFixedDepositName() {
        return fixedDepositName;
    }

    public void setFixedDepositName(String fixedDepositName) {
        this.fixedDepositName = fixedDepositName;
    }

    public BigDecimal getFixedDepositPrincipal() {
        return fixedDepositPrincipal;
    }

    public void setFixedDepositPrincipal(BigDecimal fixedDepositPrincipal) {
        this.fixedDepositPrincipal = fixedDepositPrincipal;
    }

    public BigDecimal getFixedDepositInterestRate() {
        return fixedDepositInterestRate;
    }

    public void setFixedDepositInterestRate(BigDecimal fixedDepositInterestRate) {
        this.fixedDepositInterestRate = fixedDepositInterestRate;
    }

    public String getFixedDepositTenure() {
        return fixedDepositTenure;
    }

    public void setFixedDepositTenure(String fixedDepositTenure) {
        this.fixedDepositTenure = fixedDepositTenure;
    }

    public Long getAccountId() {
        return accountId;
    }

    public void setAccountId(Long accountId) {
        this.accountId = accountId;
    }

    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public String getFixedDepositStartDate() {
        return fixedDepositStartDate;
    }

    public void setFixedDepositStartDate(String fixedDepositStartDate) {
        this.fixedDepositStartDate = fixedDepositStartDate;
    }
}
