package com.lucas.banking.banking_backend.repository;

import com.lucas.banking.banking_backend.dto.AnalisysReturnDTO;
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
           "(t.wallet = :wallet AND (t.type = 'TRANSFER' OR t.type = 'WITHDRAW' OR t.type = 'INVESTMENT') AND t.status = 'COMPLETED') " +
           "ORDER BY t.createdAt DESC")
    List<Transaction> findExpensesByWallet(@Param("wallet") Wallet wallet);
    @Query("SELECT t FROM Transaction t WHERE " +
           "(t.receiverWallet = :wallet AND t.type = 'TRANSFER' AND t.status = 'COMPLETED') OR " +
           "(t.wallet = :wallet AND t.type = 'DEPOSIT' AND t.status = 'COMPLETED') " +
           "ORDER BY t.createdAt DESC")
    List<Transaction> findIncomesByWallet(@Param("wallet") Wallet wallet);
    @Query("SELECT new com.lucas.banking.banking_backend.dto.AnalisysReturnDTO(" +
       "COALESCE(SUM(CASE WHEN t.type = 'TRANSFER' AND t.wallet = :wallet THEN t.amount ELSE 0 END), 0), " +
       "COALESCE(SUM(CASE WHEN t.type = 'TRANSFER' AND t.receiverWallet = :wallet THEN t.amount ELSE 0 END), 0), " + // Soma o que recebeu
       "COALESCE(SUM(CASE WHEN t.type = 'WITHDRAW' THEN t.amount ELSE 0 END), 0), " +
       "COALESCE(SUM(CASE WHEN t.type = 'DEPOSIT' THEN t.amount ELSE 0 END), 0), " +
       "COALESCE(SUM(CASE WHEN t.type = 'INVESTMENT' THEN t.amount ELSE 0 END), 0), " +
       "COUNT(CASE WHEN t.type = 'TRANSFER' AND t.wallet = :wallet THEN 1 END), " +
       "COUNT(CASE WHEN t.type = 'TRANSFER' AND t.receiverWallet = :wallet THEN 1 END), " + // Conta o que recebeu
       "COUNT(CASE WHEN t.type = 'WITHDRAW' THEN 1 END), " +
       "COUNT(CASE WHEN t.type = 'DEPOSIT' THEN 1 END), " +
       "COUNT(CASE WHEN t.type = 'INVESTMENT' THEN 1 END)) " +
       "FROM Transaction t WHERE t.wallet = :wallet OR t.receiverWallet = :wallet")
    AnalisysReturnDTO getAnalysisByWallet(@Param("wallet") Wallet wallet);
}
