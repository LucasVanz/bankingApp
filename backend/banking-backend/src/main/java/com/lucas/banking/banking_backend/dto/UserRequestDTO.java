package com.lucas.banking.banking_backend.dto;

import com.lucas.banking.banking_backend.validation.PhoneNumber;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record UserRequestDTO(
        @NotEmpty(message = "CPF is required") String cpf,
        @NotEmpty(message = "Name is required") String name,
        @Email @NotEmpty(message = "Email is required") String email,
        @PhoneNumber @NotEmpty(message = "Phone is required") String phone,
        @NotEmpty(message = "Password is required") String password
) { }
