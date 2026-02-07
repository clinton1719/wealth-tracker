package com.backend.wealth_tracker.dto.request_dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateFixedDepositDTO(
        Long fixedDepositId,
        String fixedDepositName,
        BigDecimal fixedDepositPrincipal,
        Long fixedDepositInterestRate,
        String fixedDepositTenure,
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy")
        LocalDate fixedDepositStartDate,
        Long accountId,
        Long profileId
) {
}
