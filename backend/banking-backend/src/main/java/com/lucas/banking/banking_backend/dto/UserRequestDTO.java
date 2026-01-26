package com.lucas.banking.banking_backend.dto;

import com.lucas.banking.banking_backend.validation.PhoneNumber;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record UserRequestDTO(
        @NotEmpty String cpf,
        @NotEmpty String name,
        @Email @NotEmpty String email,
        @PhoneNumber @NotEmpty String phone,
        @NotEmpty String password
) { }
