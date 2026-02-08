package com.lucas.banking.banking_backend.dto;

import com.lucas.banking.banking_backend.entity.FinancialAssetType;

import java.math.BigDecimal;

public record FinancialAssetDTO(
    String name,
    String ticker,
    FinancialAssetType type,
    BigDecimal currentPrice,
    BigDecimal yieldPercentage
) {
    
}
