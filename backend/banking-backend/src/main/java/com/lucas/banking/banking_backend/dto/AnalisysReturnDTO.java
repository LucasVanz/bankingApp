package com.lucas.banking.banking_backend.dto;

import java.math.BigDecimal;

public record AnalisysReturnDTO (
    BigDecimal totalAmountTransferSent,
    BigDecimal totalAmountTransferReceived,
    BigDecimal totalAmountWithdraw,
    BigDecimal totalAmountDeposit,
    Long countTransferSent,
    Long countTransferReceived,
    Long countWithdraw,
    Long countDeposit
){}
