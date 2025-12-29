package com.lucas.banking.banking_backend.entity;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.lucas.banking.banking_backend.config.CpfMaskSerializer;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.validator.constraints.br.CPF;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "users")
@JsonIgnoreProperties({"id", "password", "passwordHash", "email", "status", "createdAt"})
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @Column(unique = true)
    @NotEmpty
    @CPF
    @JsonSerialize(using = CpfMaskSerializer.class)
    private String cpf;
    @NotEmpty
    private String name;
    @NotEmpty
    private String email;
    @NotEmpty
    private String passwordHash;
    @NotEmpty
    private String agency;
    @NotEmpty
    private String account;
    @NotEmpty
    private String verificationDigit;
    @NotNull
    @Enumerated(EnumType.STRING)
    private Status status;
    @NotNull
    private LocalDateTime createdAt;

    public User(String cpf, String name, String email, String password, String agency, String account, String verificationDigit) {
        this.cpf = cpf;
        this.name = name;
        this.email = email;
        this.passwordHash = password;
        this.agency = agency;
        this.account = account;
        this.verificationDigit = verificationDigit;
        this.status = Status.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public String getPassword() {
        return this.passwordHash;
    }

    @Override
    public String getUsername() {
        return this.email;
    }
}
