package com.lucas.banking.banking_backend.dto;

import jakarta.validation.constraints.NotBlank;

public record UserRequestUpdateDTO(
    @NotBlank String name,
    @NotBlank String email,
    @NotBlank String phone,
    String photoBase64
) 
{ } 
