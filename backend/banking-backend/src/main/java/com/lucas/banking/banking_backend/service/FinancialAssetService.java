package com.lucas.banking.banking_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lucas.banking.banking_backend.dto.FinancialAssetDTO;
import com.lucas.banking.banking_backend.entity.FinancialAsset;
import com.lucas.banking.banking_backend.entity.FinancialAssetType;
import com.lucas.banking.banking_backend.repository.FinancialAssetRepository;


@Service
public class FinancialAssetService {

    @Autowired
    FinancialAssetRepository financialAssetRepository;
    
    public List<FinancialAssetDTO> getAllAssets(){
        
        List<FinancialAsset> allFinancialAssets = financialAssetRepository.findAll();
        return allFinancialAssets.stream()
                                 .map(financialAsset -> new FinancialAssetDTO(
                                        financialAsset.getName(), 
                                        financialAsset.getTicker(), 
                                        financialAsset.getType(), 
                                        financialAsset.getCurrentPrice(),
                                        financialAsset.getYieldPercentage()))
                                 .toList();
    }

    public List<FinancialAssetDTO> getFixedAssets(){
        
        List<FinancialAsset> allFinancialAssets = financialAssetRepository.findByType(FinancialAssetType.FIXED).orElseThrow(() -> new RuntimeException("No fixed assets found"));
        return allFinancialAssets.stream()
                                 .map(financialAsset -> new FinancialAssetDTO(
                                        financialAsset.getName(), 
                                        financialAsset.getTicker(), 
                                        financialAsset.getType(), 
                                        financialAsset.getCurrentPrice(),
                                        financialAsset.getYieldPercentage()))
                                 .toList();
    }

    public List<FinancialAssetDTO> getVariableAssets(){
        
        List<FinancialAsset> allFinancialAssets = financialAssetRepository.findByType(FinancialAssetType.VARIABLE).orElseThrow(() -> new RuntimeException("No variable assets found"));
        return allFinancialAssets.stream()
                                 .map(financialAsset -> new FinancialAssetDTO(
                                        financialAsset.getName(), 
                                        financialAsset.getTicker(), 
                                        financialAsset.getType(), 
                                        financialAsset.getCurrentPrice(),
                                        financialAsset.getYieldPercentage()))
                                 .toList();
    }

    public FinancialAsset getAssetByTicker(String ticker){
        return financialAssetRepository.findByTicker(ticker).orElseThrow(() -> new RuntimeException("Asset " + ticker + " not found"));
    }

}
