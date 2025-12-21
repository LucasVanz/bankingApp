package com.lucas.banking.banking_backend.service;

import com.lucas.banking.banking_backend.entity.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.util.Date;
@Service
public class TokenService {
    private String secret = "minha-chave-secreta-muito-segura-com-mais-de-trinta-e-dois-caracteres";
    public String generateToken(User user){
        return Jwts.builder()
                .setSubject(user.getEmail())
                .setIssuedAt(new Date()).setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 horas
                .signWith(Keys.hmacShaKeyFor(secret.getBytes()), SignatureAlgorithm.HS256)
                .compact();
    }

    public String validateToken(String token){
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(Keys.hmacShaKeyFor(secret.getBytes()))
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        }catch (Exception exception){
            return null;
        }

    }
}
