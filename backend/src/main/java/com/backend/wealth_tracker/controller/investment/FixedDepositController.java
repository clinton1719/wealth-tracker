package com.backend.wealth_tracker.controller.investment;

import com.backend.wealth_tracker.model.investment.FixedDeposit;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/v1/investments/fixed-deposits")
public class FixedDepositController {

  @GetMapping("/all")
  public List<FixedDeposit> getAllFixedDeposits() {
    List<FixedDeposit> fixedDepositList = new ArrayList<>();
    FixedDeposit fixedDeposit = new FixedDeposit();
    fixedDeposit.setFixedDepositId(1L);
    fixedDeposit.setFixedDepositInterestRate(new BigDecimal("2.5"));

    fixedDeposit.setFixedDepositName("HDFC deposit");

    fixedDeposit.setFixedDepositPrincipal(new BigDecimal("200000"));
    fixedDeposit.setFixedDepositStartDate("12-12-2025");
    fixedDeposit.setFixedDepositTenure("1 year");
    fixedDeposit.setAccountId(1L);
    fixedDeposit.setProfileId(1L);
    fixedDepositList.add(fixedDeposit);
    return fixedDepositList;
  }
}
