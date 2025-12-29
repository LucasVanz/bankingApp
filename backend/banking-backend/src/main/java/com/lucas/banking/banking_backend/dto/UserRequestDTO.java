package com.lucas.banking.banking_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record UserRequestDTO(
        @NotEmpty String cpf,
        @NotEmpty String name,
        @Email @NotEmpty String email,
        @NotEmpty String password,
        @NotEmpty String agency,
        @NotEmpty String account,
        @NotEmpty String verificationDigit
) { }
