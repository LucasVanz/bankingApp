package com.lucas.banking.banking_backend.repository;

import com.lucas.banking.banking_backend.entity.Transaction;
import com.lucas.banking.banking_backend.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByWalletOrReceiverWalletOrderByCreatedAtDesc(Wallet wallet, Wallet receiverWallet);
}
