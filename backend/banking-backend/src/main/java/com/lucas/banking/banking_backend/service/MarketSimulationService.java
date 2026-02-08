package com.lucas.banking.banking_backend.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.lucas.banking.banking_backend.entity.FinancialAsset;
import com.lucas.banking.banking_backend.entity.FinancialAssetType;
import com.lucas.banking.banking_backend.repository.FinancialAssetRepository;

@Service
public class MarketSimulationService {

    @Autowired
    private FinancialAssetRepository financialAssetRepository;

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
}