package com.lucas.banking.banking_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record WithdrawRequestDTO(@NotNull @DecimalMin(value = "0.01") BigDecimal amount) {
}
