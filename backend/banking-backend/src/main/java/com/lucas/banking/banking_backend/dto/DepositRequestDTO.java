package com.lucas.banking.banking_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record DepositRequestDTO(@NotNull @DecimalMin(value = "0.01", message = "Must be greater than or equal to 0.01") BigDecimal amount) {
}
