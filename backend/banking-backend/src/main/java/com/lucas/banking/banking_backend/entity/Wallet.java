package com.lucas.banking.banking_backend.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "wallets")
public class Wallet {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotNull
    @Column(precision = 19, scale = 2)
    @Builder.Default private BigDecimal balance = BigDecimal.ZERO;
    @NotEmpty
    private String currency;
    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;
    @Enumerated(EnumType.STRING)
    @Builder.Default private Status status = Status.ACTIVE;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm")
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm")
    private LocalDateTime updatedAt;

    public Wallet(User user){
        this.user = user;
        this.balance = BigDecimal.ZERO;
        this.currency = "BRL";
        this.status = Status.ACTIVE;
        this.createdAt = LocalDateTime.now();
    }
}
