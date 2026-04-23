package com.lucas.banking.banking_backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.lucas.banking.banking_backend.entity.FinancialAsset;
import com.lucas.banking.banking_backend.entity.FinancialAssetType;
import com.lucas.banking.banking_backend.entity.Transaction;
import com.lucas.banking.banking_backend.entity.TransactionStatus;
import com.lucas.banking.banking_backend.entity.TransactionType;
import com.lucas.banking.banking_backend.entity.UserInvestment;
import com.lucas.banking.banking_backend.repository.FinancialAssetRepository;
import com.lucas.banking.banking_backend.repository.TransactionRepository;
import com.lucas.banking.banking_backend.repository.UserInvestimentRepository;

@Service
public class MarketSimulationService {

    @Autowired
    private FinancialAssetRepository financialAssetRepository;

    @Autowired
    private UserInvestimentRepository userInvestmentRepository;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private TransactionService transactionService;

    // Roda a cada 30 segundos (30000 milissegundos)
    @Scheduled(fixedRate = 30000)
    public void updateMarketPrices() {
        List<FinancialAsset> assets = financialAssetRepository.findAll();

        for (FinancialAsset asset : assets) {
            if (asset.getType() == FinancialAssetType.VARIABLE) {
                // Gera uma variação entre -1.5% e +1.5%
                BigDecimal constant = new BigDecimal(0.985);
                BigDecimal variation = constant.add((new BigDecimal(Math.random() * 0.03)));
                BigDecimal newPrice = asset.getCurrentPrice().multiply(variation);
                
                // Arredonda para 2 casas decimais
                asset.setCurrentPrice(((newPrice.multiply(new BigDecimal(100.00))).divide(new BigDecimal(100.00))));
                asset.setLastUpdate(LocalDateTime.now());
            }
        }
        financialAssetRepository.saveAll(assets);
    }

    // TODO: REVISAR O MÉTODO
    @Scheduled(fixedRate = 60000) // Roda a cada 60 segundos (60000 milissegundos)
    public void throwDividends() {
        List<UserInvestment> userInvestments = userInvestmentRepository.findByFinancialAssetType(FinancialAssetType.FIXED);

        for (UserInvestment userInvestment : userInvestments) {
            FinancialAsset financialAsset = userInvestment.getFinancialAsset();
            BigDecimal yieldPercentage = financialAsset.getYieldPercentage();
            if (yieldPercentage == null || yieldPercentage.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            BigDecimal dividendAmount = financialAsset.getCurrentPrice()
                    .multiply(userInvestment.getQuantity())
                    .multiply(yieldPercentage)
                    .divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP);

            if (dividendAmount.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            Transaction transaction = new Transaction();
            transaction.setAmount(dividendAmount);
            transaction.setType(TransactionType.DIVIDEND);
            transaction.setStatus(TransactionStatus.PENDING);
            transaction.setWallet(userInvestment.getWallet());
            transaction.setFinancialAsset(financialAsset);
            transaction.setQuantityFinancialAsset(userInvestment.getQuantity());
            transaction.setCreatedAt(LocalDateTime.now());

            transactionRepository.save(transaction);
            transactionService.confirmTransaction(transaction.getId());
        }
    }
}
