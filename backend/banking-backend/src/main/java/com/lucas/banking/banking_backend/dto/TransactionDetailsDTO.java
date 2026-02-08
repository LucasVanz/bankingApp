package com.lucas.banking.banking_backend.dto;

import java.math.BigDecimal;

import com.lucas.banking.banking_backend.entity.FinancialAsset;
import com.lucas.banking.banking_backend.entity.TransactionType;

public record TransactionDetailsDTO(
    BigDecimal amount,
    TransactionType type,
    FinancialAsset financialAsset
) {
    
}
