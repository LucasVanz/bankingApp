package com.lucas.banking.banking_backend.controller;

import com.lucas.banking.banking_backend.dto.LoginRequestDTO;
import com.lucas.banking.banking_backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> authUser(@RequestBody @Valid LoginRequestDTO data){
        String token = authService.authenticate(data);
        return ResponseEntity.ok(token);
    }
}
