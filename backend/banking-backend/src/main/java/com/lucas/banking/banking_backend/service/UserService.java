package com.lucas.banking.banking_backend.service;

import com.lucas.banking.banking_backend.dto.UserRequestDTO;
import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.entity.Wallet;
import com.lucas.banking.banking_backend.repository.UserRepository;
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
                data.cpf(),
                data.name(),
                data.email(),
                hash
        );
        // Busca a conta com maior número
        long lastAccount = userRepository.findFirstByOrderByAccountDesc().map(User::getAccount).orElse(9999L);
        newUser.setAccount(lastAccount + 1);
        // Salva o usuário criado
        User savedUser = userRepository.save(newUser);

        // Cria uma nova carteira para o usuário
        Wallet wallet = new Wallet(savedUser);
        walletService.save(wallet);

        // Retorna o usuário criado
        return savedUser;
    }

    public User findByCpf(String cpf){
        return userRepository.findByCpf(cpf).orElseThrow(() -> new RuntimeException("User not found with CPF: " + cpf));
    }

    public User findByEmail(String email){
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }
    public List<User> findAll(){
        return userRepository.findAll();
    }


}
