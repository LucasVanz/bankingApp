package com.lucas.banking.banking_backend.service;

import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.entity.Wallet;
import com.lucas.banking.banking_backend.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WalletService {
    @Autowired
    WalletRepository walletRepository;

    public void save(Wallet wallet){
        walletRepository.save(wallet);
    }

    public Wallet findByUser(User user){
        return walletRepository.findByUser(user).get();
    }
    public List<Wallet> findAll(){
        return walletRepository.findAll();
    }
}
