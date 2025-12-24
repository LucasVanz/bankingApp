package com.lucas.banking.banking_backend.service;
import com.lucas.banking.banking_backend.entity.*;
import com.lucas.banking.banking_backend.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class TransactionService {
    @Autowired
    TransactionRepository transactionRepository;
    @Autowired
    WalletService walletService;

    public UUID requestDeposit(User user, BigDecimal amount){
        Transaction transaction = new Transaction();
        // Efetua a carga dos dados da transação
        transaction.setAmount(amount);
        transaction.setType(TransactionType.DEPOSIT);
        transaction.setStatus(TransactionStatus.PENDING);
        // Busca a carteira pelo usuário
        Wallet wallet = walletService.findByUser(user);
        transaction.setWallet(wallet);
        transactionRepository.save(transaction);
        return transaction.getId();
    }

    @Transactional
    public boolean confirmDeposit(UUID idTransaction){
        Transaction transaction = transactionRepository
                .findById(idTransaction)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada"));
        // Se o status da transação for pendente
        if (transaction.getStatus() == TransactionStatus.PENDING){
            Wallet wallet = transaction.getWallet();
            // Indica que a transação foi completa
            transaction.setStatus(TransactionStatus.COMPLETED);
            transactionRepository.save(transaction);
            // Atualiza o valor à carteira
            wallet.setBalance(wallet.getBalance().add(transaction.getAmount()));
            wallet.setUpdatedAt(LocalDateTime.now());
            walletService.save(wallet);
            return true;
        }
        return false;
    }
}
