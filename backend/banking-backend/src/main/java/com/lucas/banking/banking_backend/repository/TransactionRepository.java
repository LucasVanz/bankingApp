package com.lucas.banking.banking_backend.repository;

import com.lucas.banking.banking_backend.entity.Transaction;
import com.lucas.banking.banking_backend.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByWalletOrReceiverWalletOrderByCreatedAtDesc(Wallet wallet, Wallet receiverWallet);
    @Query("SELECT t FROM Transaction t WHERE " +
           "(t.wallet = :wallet AND (t.type = 'TRANSFER' OR t.type = 'WITHDRAW') AND t.status = 'COMPLETED') " +
           "ORDER BY t.createdAt DESC")
    List<Transaction> findExpensesByWallet(@Param("wallet") Wallet wallet);
    @Query("SELECT t FROM Transaction t WHERE " +
           "(t.receiverWallet = :wallet AND t.type = 'TRANSFER' AND t.status = 'COMPLETED') OR " +
           "(t.wallet = :wallet AND t.type = 'DEPOSIT' AND t.status = 'COMPLETED') " +
           "ORDER BY t.createdAt DESC")
    List<Transaction> findIncomesByWallet(@Param("wallet") Wallet wallet);
}
