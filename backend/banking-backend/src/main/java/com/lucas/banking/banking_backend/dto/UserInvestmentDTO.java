package com.lucas.banking.banking_backend.dto;

import java.math.BigDecimal;

import com.lucas.banking.banking_backend.entity.FinancialAssetType;

public record UserInvestmentDTO(
    String name,
    String ticker,
    FinancialAssetType financialAssetType,
    BigDecimal currentPrice,
    BigDecimal yieldPercentage,
    BigDecimal quantity,
    BigDecimal avaragePrice,
    BigDecimal profitability
) {}
