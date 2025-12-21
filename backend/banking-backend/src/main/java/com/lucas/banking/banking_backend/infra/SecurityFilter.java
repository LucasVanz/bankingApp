package com.lucas.banking.banking_backend.infra;

import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.repository.UserRepository;
import com.lucas.banking.banking_backend.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
@Component
public class SecurityFilter extends OncePerRequestFilter {

    @Autowired
    TokenService tokenService;
    @Autowired
    UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String headerRequest = request.getHeader("Authorization");
        // Se possui conteúdo no cabeçalho da requisição
        if (headerRequest != null && headerRequest.startsWith("Bearer ")){
            // Elimina a parte desnecessária do token
            String token = headerRequest.replace("Bearer ", "");
            // Faz a validação do token, retornando o email encontrado
            String email = tokenService.validateToken(token);
            // Se não encontrou o email pelo token
            if (email == null || email.isEmpty()){
                throw new RuntimeException("User not found");
            }else {
                // Busca o usuário pelo email
                User user = userRepository.findByEmail(email).get();
                // Atribui os dados do usuário para um formato que o Spring interpreta
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());

                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
            }
        }

        filterChain.doFilter(request, response);

    }
}
