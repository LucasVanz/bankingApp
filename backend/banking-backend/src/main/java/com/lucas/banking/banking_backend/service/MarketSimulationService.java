package com.lucas.banking.banking_backend.service;

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
                double variation = 0.985 + (Math.random() * 0.03);
                double newPrice = asset.getCurrentPrice() * variation;
                
                // Arredonda para 2 casas decimais
                asset.setCurrentPrice(Math.round(newPrice * 100.0) / 100.0);
                asset.setLastUpdate(LocalDateTime.now());
            }
        }
        financialAssetRepository.saveAll(assets);
    }
}