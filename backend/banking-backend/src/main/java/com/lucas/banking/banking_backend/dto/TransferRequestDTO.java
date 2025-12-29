package com.lucas.banking.banking_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.br.CPF;

import java.math.BigDecimal;

public record TransferRequestDTO (@NotNull @DecimalMin(value = "0.01") BigDecimal amount, @NotEmpty @CPF String receiverCpf){
}
