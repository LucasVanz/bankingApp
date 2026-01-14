package com.lucas.banking.banking_backend.entity;
import com.fasterxml.jackson.annotation.JsonFormat;
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
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity(name = "users")
@JsonIgnoreProperties({"password", "passwordHash", "email", "status", "createdAt"})
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(unique = true)
    @NotEmpty
    @CPF
    @JsonSerialize(using = CpfMaskSerializer.class)
    private String cpf;
    @NotEmpty
    private String name;
    @Column(unique = true, nullable = false)
    @NotEmpty
    private String email;
    @NotEmpty
    private String passwordHash;
    @NotEmpty
    private String agency;
    @NotNull
    @Column(unique = true, nullable = false)
    private Long account;
    private String verificationDigit;
    @NotNull
    @Enumerated(EnumType.STRING)
    private Status status;
    @NotNull
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime createdAt;

    public User(String cpf, String name, String email, String password) {
        this.cpf = cpf;
        this.name = name;
        this.email = email;
        this.passwordHash = password;
        this.agency = "0001";
        this.status = Status.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.account != null) {
            this.verificationDigit = String.valueOf(this.account % 10);
        }
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
