package com.backend.wealth_tracker.dto.response_dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ResponseFixedDepositDTO(
        Long fixedDepositId,
        String fixedDepositName,
        BigDecimal fixedDepositPrincipal,
        Long fixedDepositInterestRate,
        String fixedDepositTenure,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        LocalDate fixedDepositStartDate,
        Long accountId,
        Long profileId,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        LocalDate fixedDepositMaturityDate,
        BigDecimal fixedDepositMaturityAmount,
        BigDecimal fixedDepositInterestEarned
) {
}
