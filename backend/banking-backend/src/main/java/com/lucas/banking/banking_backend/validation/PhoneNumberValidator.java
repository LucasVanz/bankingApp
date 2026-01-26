package com.lucas.banking.banking_backend.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PhoneNumberValidator implements ConstraintValidator<PhoneNumber, String>{
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) return false;
        // Regex para aceitar apenas números (11 dígitos)
        return value.matches("\\d{11}"); 
    }
}
