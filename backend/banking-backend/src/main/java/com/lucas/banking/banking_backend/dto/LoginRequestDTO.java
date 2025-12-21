package com.lucas.banking.banking_backend.dto;

import jakarta.validation.constraints.NotEmpty;

public record LoginRequestDTO(
        @NotEmpty String email,
        @NotEmpty String password
) { }
