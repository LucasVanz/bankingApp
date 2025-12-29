package com.lucas.banking.banking_backend.controller;

import com.lucas.banking.banking_backend.dto.DepositRequestDTO;
import com.lucas.banking.banking_backend.dto.TransferRequestDTO;
import com.lucas.banking.banking_backend.dto.WithdrawRequestDTO;
import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/transaction")
public class TransactionController {
    @Autowired
    TransactionService transactionService;

    @PostMapping("/deposit")
    public UUID depositRequest(@AuthenticationPrincipal User user,@RequestBody @Valid DepositRequestDTO data){
        return transactionService.requestDeposit(user, data.amount());
    }
    @PostMapping("/withdraw")
    public UUID withdrawRequest(@AuthenticationPrincipal User user,@RequestBody @Valid WithdrawRequestDTO data){
        return transactionService.requestWithdraw(user, data.amount());
    }

    @PostMapping("/transfer")
    public UUID transferRequest(@AuthenticationPrincipal User user,@RequestBody @Valid TransferRequestDTO data){
        return transactionService.requestTransfer(user, data.receiverCpf(), data.amount());
    }
    @PostMapping("/confirm/{id}")
    public ResponseEntity<String> confirmTransaction(@PathVariable UUID id){

        if(transactionService.confirmTransaction(id)){
            return ResponseEntity.ok("Transaction completed successfully!");
        }
        return ResponseEntity.badRequest().body("Invalid transaction or transaction already processed");

    }
}
