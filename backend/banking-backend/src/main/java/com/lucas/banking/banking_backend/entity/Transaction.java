package com.lucas.banking.banking_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
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
public class Transaction {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;
    @NotNull
    @Enumerated(EnumType.STRING)
    private TransactionType type;
    @NotNull
    @Enumerated(EnumType.STRING)
    private TransactionStatus status;
    @ManyToOne
    private Wallet wallet;
    @ManyToOne
    private Wallet receiverWallet;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd/MM/yyyy HH:mm")
    @Builder.Default private LocalDateTime createdAt = LocalDateTime.now();
}
