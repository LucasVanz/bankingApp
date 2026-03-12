package com.lucas.banking.banking_backend.controller;

import com.lucas.banking.banking_backend.dto.AnalisysReturnDTO;
import com.lucas.banking.banking_backend.dto.UserInvestmentDTO;
import com.lucas.banking.banking_backend.dto.UserRequestDTO;
import com.lucas.banking.banking_backend.dto.UserRequestUpdateDTO;
import com.lucas.banking.banking_backend.entity.StatementType;
import com.lucas.banking.banking_backend.entity.Transaction;
import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.entity.Wallet;
import com.lucas.banking.banking_backend.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
    @Autowired
    UserInvestimentService userInvestimentService;
    @Autowired
    EmailService emailService;

    @PostMapping("/create")
    public ResponseEntity<User> createUser(@RequestBody @Valid UserRequestDTO data) {
        // Cria o usuário com a carteira
        User savedUser = userService.createWithWallet(data);
        // Retorna status OK se foi criado sem erros
        return ResponseEntity.ok(savedUser);
    }

    @PutMapping("/me/update")
    public ResponseEntity<UserRequestUpdateDTO> updateUser(@AuthenticationPrincipal User user,
            @RequestBody @Valid UserRequestUpdateDTO data) {
        return ResponseEntity.ok(userService.updateUser(user, data));
    }

    @GetMapping("/me")
    public ResponseEntity<User> getUser(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(user);
    }

    @GetMapping("/me/wallet")
    public ResponseEntity<Wallet> getUserWallet(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(walletService.findByUser(user));
    }

    @GetMapping("/me/transactions")
    public ResponseEntity<List<Transaction>> getUserTransactions(@AuthenticationPrincipal User user,
            @RequestParam(required = true) StatementType type,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        return ResponseEntity.ok(transactionService.getTransactions(user, type, startDate, endDate));
    }

    @GetMapping("/me/transactions/email")
    public ResponseEntity<String> sendStatementEmail(@AuthenticationPrincipal User user,
            @RequestParam(required = true) StatementType type,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        try {
            transactionService.sendStatementEmail(user, type, startDate, endDate);
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("me/analisys")
    public ResponseEntity<AnalisysReturnDTO> getTransactionsAnalisys(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(transactionService.getAnalysisByUserId(user));
    }

    @GetMapping("me/investmentWallet")
    public ResponseEntity<List<UserInvestmentDTO>> getAllUserInvestment(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userInvestimentService.getAllUserInvestment(user));
    }

}
