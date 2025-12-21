package com.lucas.banking.banking_backend.service;

import com.lucas.banking.banking_backend.dto.UserRequestDTO;
import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.entity.Wallet;
import com.lucas.banking.banking_backend.repository.UserRepository;
import com.lucas.banking.banking_backend.repository.WalletRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;
    @Autowired
    WalletService walletService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Transactional
    public User createWithWallet(UserRequestDTO data){
        String hash = passwordEncoder.encode(data.password());

        User newUser = new User(
                data.name(),
                data.email(),
                hash,
                data.agency(),
                data.account(),
                data.verificationDigit()
        );

        // Salva o usuário criado
        User savedUser = userRepository.save(newUser);

        // Cria uma nova carteira para o usuário
        Wallet wallet = new Wallet(savedUser);
        walletService.save(wallet);

        // Retorna o usuário criado
        return savedUser;
    }

    public List<User> findAll(){
        return userRepository.findAll();
    }
}
