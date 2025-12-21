package com.lucas.banking.banking_backend.service;

import com.lucas.banking.banking_backend.dto.LoginRequestDTO;
import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.exception.InvalidCredentialsException;
import com.lucas.banking.banking_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;
    public String authenticate(LoginRequestDTO data){
        // Busca o usuário pelo email passado
        User user = userRepository.findByEmail(data.email()).orElseThrow(() -> new RuntimeException("User not found"));

        // Compara a senha enviada com o hash do banco
        if (passwordEncoder.matches(data.password(), user.getPasswordHash())){
            return tokenService.generateToken(user);
        }
        // Retorna aviso caso senha não corresponder
        throw new InvalidCredentialsException("Email ou senha incorretos");
    }
}
