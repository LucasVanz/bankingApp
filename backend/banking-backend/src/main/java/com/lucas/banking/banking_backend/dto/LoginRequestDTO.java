package com.lucas.banking.banking_backend.dto;

import jakarta.validation.constraints.NotEmpty;

public record LoginRequestDTO(
        @NotEmpty(message = "CPF is required") String cpf,
        @NotEmpty(message = "Password is required") String password
) { }
