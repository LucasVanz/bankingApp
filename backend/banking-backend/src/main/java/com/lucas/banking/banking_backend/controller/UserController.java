package com.lucas.banking.banking_backend.controller;

import com.lucas.banking.banking_backend.dto.UserRequestDTO;
import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.service.UserService;
import com.lucas.banking.banking_backend.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    WalletService walletService;

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody @Valid UserRequestDTO data){
        // Cria o usuário com a carteira
        User savedUser = userService.createWithWallet(data);
        // Retorna status OK se foi criado sem erros
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/me")
    public ResponseEntity getUser(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(user);
    }
    @GetMapping("/me/wallet")
    public ResponseEntity getUserWallet(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(walletService.findByUser(user));
    }

}
