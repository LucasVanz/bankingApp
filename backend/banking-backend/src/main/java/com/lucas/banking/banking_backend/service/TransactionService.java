package com.lucas.banking.banking_backend.service;
import com.lucas.banking.banking_backend.entity.*;
import com.lucas.banking.banking_backend.repository.TransactionRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class TransactionService {
    @Autowired
    TransactionRepository transactionRepository;
    @Autowired
    WalletService walletService;
    @Autowired
    UserService userService;
    @Transactional
    public UUID requestDeposit(User user, BigDecimal amount){
        // Busca a carteira pelo usuário
        Wallet wallet = walletService.findByUser(user);
        Transaction transaction = new Transaction();
        // Efetua a carga dos dados da transação
        transaction.setAmount(amount);
        transaction.setType(TransactionType.DEPOSIT);
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setWallet(wallet);
        transactionRepository.save(transaction);
        return transaction.getId();
    }
    @Transactional
    public UUID requestWithdraw(User user, BigDecimal amount){
        // Busca a carteira pelo usuário
        Wallet wallet = walletService.findByUser(user);
        // Verifica se possui saldo na carteira
        if (!haveBalance(wallet, amount)){
            throw new RuntimeException("Insufficient funds... The current balance is R$" + wallet.getBalance());
        }
        // Efetua a carga dos dados da transação
        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setType(TransactionType.WITHDRAW);
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setWallet(wallet);
        transactionRepository.save(transaction);
        return transaction.getId();
    }

    public UUID requestTransfer(User user, String receiverCpf, BigDecimal amount){
        Wallet walletUser = walletService.findByUser(user);
        Wallet walletReceiver = walletService.findByUser(userService.findByCpf(receiverCpf));
        // Verifica se não está fazendo uma transferência para a mesma conta
        if (user.getCpf().equalsIgnoreCase(receiverCpf)){
            throw new RuntimeException("It is not possible to make transfers using the same account");
        }
        // Verifica se possui saldo na carteira
        if (!haveBalance(walletUser, amount)){
            throw new RuntimeException("Insufficient funds at the time of transfer request.... " +
                                       "The current balance is R$" + walletUser.getBalance());
        }
        // Efetua a carga dos dados da transação
        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setType(TransactionType.TRANSFER);
        transaction.setStatus(TransactionStatus.PENDING);
        transaction.setWallet(walletUser);
        transaction.setReceiverWallet(walletReceiver);
        transactionRepository.save(transaction);
        return transaction.getId();
    }
    @Transactional
    public boolean confirmTransaction(UUID idTransaction){
        Transaction transaction = transactionRepository
                .findById(idTransaction)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        // Se o status da transação for pendente
        if (transaction.getStatus() == TransactionStatus.PENDING){
            Wallet wallet = transaction.getWallet();
            // Atualiza o valor da carteira
            switch (transaction.getType()){
                case DEPOSIT -> wallet.setBalance(wallet.getBalance().add(transaction.getAmount()));
                case WITHDRAW -> {
                    if (!haveBalance(wallet, transaction.getAmount())) {
                        throw new RuntimeException("Insufficient funds at the time of confirmation");
                    }
                    wallet.setBalance(wallet.getBalance().subtract(transaction.getAmount()));
                }
                case TRANSFER -> {
                    if (!haveBalance(wallet, transaction.getAmount())) {
                        throw new RuntimeException("Insufficient funds at the time of confirmation");
                    }
                    Wallet receiverWallet = transaction.getReceiverWallet();
                    wallet.setBalance(wallet.getBalance().subtract(transaction.getAmount()));
                    receiverWallet.setBalance(receiverWallet.getBalance().add(transaction.getAmount()));
                    receiverWallet.setUpdatedAt(LocalDateTime.now());
                    walletService.save(receiverWallet);
                }
            }
            wallet.setUpdatedAt(LocalDateTime.now());
            walletService.save(wallet);
            // Indica que a transação foi completa
            transaction.setStatus(TransactionStatus.COMPLETED);
            transactionRepository.save(transaction);
            return true;
        }
        return false;
    }

    public boolean haveBalance(Wallet wallet, BigDecimal amount){
        return wallet.getBalance().compareTo(amount) >= 0;
    }

    public Transaction findById(UUID id){
        return transactionRepository.getReferenceById(id);
    }
    
    public List<Transaction> getTransactions(User user){
        Wallet wallet = walletService.findByUser(user);
        return transactionRepository.findByWalletOrReceiverWalletOrderByCreatedAtDesc(wallet, wallet);
    }
}
