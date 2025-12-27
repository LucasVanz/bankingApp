package com.lucas.banking.banking_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record TransferRequestDTO (@NotNull @DecimalMin(value = "0.01") BigDecimal amount, @NotNull Long receiverId){
}
