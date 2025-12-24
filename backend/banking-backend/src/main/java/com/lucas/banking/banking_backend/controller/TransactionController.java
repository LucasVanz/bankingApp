package com.lucas.banking.banking_backend.controller;

import com.lucas.banking.banking_backend.dto.DepositRequestDTO;
import com.lucas.banking.banking_backend.entity.Transaction;
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

    @PostMapping("/confirm/{id}")
    public ResponseEntity<String> confirmDeposit(@PathVariable UUID id){

        //TODO: Fazer a lógica para procurar o tipo da transação.
        //TODO: Ex: Se for depósito, confirma o depósito, se for outra, confirma essa outra

        if(transactionService.confirmDeposit(id)){
            return ResponseEntity.ok("Depósito efetuado com sucesso!");
        }
        return ResponseEntity.badRequest().body("Transação inválida ou já processada");

    }
}
