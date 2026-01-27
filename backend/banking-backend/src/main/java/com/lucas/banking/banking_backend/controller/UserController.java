package com.lucas.banking.banking_backend.controller;

import com.lucas.banking.banking_backend.dto.AnalisysReturnDTO;
import com.lucas.banking.banking_backend.dto.UserRequestDTO;
import com.lucas.banking.banking_backend.dto.UserRequestUpdateDTO;
import com.lucas.banking.banking_backend.entity.Transaction;
import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.entity.Wallet;
import com.lucas.banking.banking_backend.service.TransactionService;
import com.lucas.banking.banking_backend.service.UserService;
import com.lucas.banking.banking_backend.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

    @PutMapping("/me/update")
    public ResponseEntity<UserRequestUpdateDTO> updateUser(@AuthenticationPrincipal User user, @RequestBody @Valid UserRequestUpdateDTO data) {
        return ResponseEntity.ok(userService.updateUser(user, data));
    }
    

    @GetMapping("/me")
    public ResponseEntity<User> getUser(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me/wallet")
    public ResponseEntity<Wallet> getUserWallet(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(walletService.findByUser(user));
    }

    @GetMapping("/me/transactions")
    public ResponseEntity<List<Transaction>> getUserTransactions(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(transactionService.getTransactions(user));
    }

    @GetMapping("/me/transactions/expenses")
    public ResponseEntity<List<Transaction>> getUserTransactionsExpenses(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(transactionService.getTransactionsExpenses(user));
    }

    @GetMapping("/me/transactions/income")
    public ResponseEntity<List<Transaction>> getUserTransactionsIncome(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(transactionService.getTransactionsIncome(user));
    }
    @GetMapping("me/analisys")
    public ResponseEntity<AnalisysReturnDTO> getTransactionsAnalisys(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(transactionService.getAnalysisByUserId(user));
    }

}
