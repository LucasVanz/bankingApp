package com.lucas.banking.banking_backend.validation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = PhoneNumberValidator.class) // Liga ao arquivo de lógica
@Target({ElementType.FIELD}) // Define que é para usar em atributos
@Retention(RetentionPolicy.RUNTIME)
public @interface PhoneNumber {
    String message() default "Invlaid phone number format";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
