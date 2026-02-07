package com.backend.wealth_tracker.investment.fixed_deposit.controller;

import com.backend.wealth_tracker.dto.request_dto.CreateFixedDepositDTO;
import com.backend.wealth_tracker.dto.response_dto.ResponseFixedDepositDTO;
import com.backend.wealth_tracker.investment.fixed_deposit.model.FixedDeposit;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import static com.backend.wealth_tracker.helper.Constants.CREATE_CALL_TAG;

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

  @PostMapping("/save")
  @ResponseStatus(HttpStatus.CREATED)
  @Tag(name = CREATE_CALL_TAG)
  public ResponseFixedDepositDTO saveFixedDeposit(@AuthenticationPrincipal UserDetails userDetails, @Valid CreateFixedDepositDTO createFixedDepositDTO) {

  }
}
