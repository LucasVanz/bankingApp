package com.lucas.banking.banking_backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

public record InvestmentRequestDTO(
    @NotEmpty 
    String ticker,
    @NotNull 
    BigDecimal quantity
) {}
