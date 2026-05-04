package com.lucas.banking.banking_backend.dto;

import java.math.BigDecimal;

public record AnalisysReturnDTO (
    BigDecimal totalAmountTransferSent,
    BigDecimal totalAmountTransferReceived,
    BigDecimal totalAmountWithdraw,
    BigDecimal totalAmountDeposit,
    BigDecimal totalAmountInvestment,
    BigDecimal totalAmountInvestmentSell,
    BigDecimal totalAmountDividend,
    Long countTransferSent,
    Long countTransferReceived,
    Long countWithdraw,
    Long countDeposit,
    Long countInvestment,
    Long countInvestmentSell,
    Long countDividend
){}
