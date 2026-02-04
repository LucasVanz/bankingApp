package com.lucas.banking.banking_backend.dto;

import com.lucas.banking.banking_backend.entity.FinancialAssetType;

public record FinancialAssetDTO(
    String name,
    String ticker,
    FinancialAssetType type,
    Double currentPrice,
    Double yieldPercentage
) {
    
}
