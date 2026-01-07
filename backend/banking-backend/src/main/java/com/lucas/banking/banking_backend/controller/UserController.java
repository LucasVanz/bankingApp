package com.lucas.banking.banking_backend.controller;

import com.lucas.banking.banking_backend.dto.UserRequestDTO;
import com.lucas.banking.banking_backend.entity.Transaction;
import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.entity.Wallet;
import com.lucas.banking.banking_backend.service.TransactionService;
import com.lucas.banking.banking_backend.service.UserService;
import com.lucas.banking.banking_backend.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    WalletService walletService;
    @Autowired
    TransactionService transactionService;
    

    @PostMapping("/create")
    public ResponseEntity<User> createUser(@RequestBody @Valid UserRequestDTO data){
        // Cria o usuário com a carteira
        User savedUser = userService.createWithWallet(data);
        // Retorna status OK se foi criado sem erros
        return ResponseEntity.ok(savedUser);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getUser(){
        // Pega o token da requisição e pega o email dele
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByEmail(email);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me/wallet")
    public ResponseEntity<Wallet> getUserWallet(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByEmail(email);
        return ResponseEntity.ok(walletService.findByUser(user));
    }

    @GetMapping("/me/transactions")
    public ResponseEntity<List<Transaction>> getUserTransactions(){
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByEmail(email);
        return ResponseEntity.ok(transactionService.getTransactions(user));
    }

}
