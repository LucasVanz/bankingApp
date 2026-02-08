package com.lucas.banking.banking_backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lucas.banking.banking_backend.entity.FinancialAsset;
import com.lucas.banking.banking_backend.entity.UserInvestment;
import com.lucas.banking.banking_backend.entity.Wallet;
import com.lucas.banking.banking_backend.repository.UserInvestimentRepository;
import com.lucas.banking.banking_backend.repository.WalletRepository;

@Service
public class UserInvestimentService {
    
    @Autowired
    UserInvestimentRepository userInvestimentRepository;

    @Autowired
    WalletRepository walletRepository;

    public boolean buyAsset(Wallet wallet, FinancialAsset financialAsset, BigDecimal quantity){
        UserInvestment userInvestment = userInvestimentRepository.findByFinancialAssetAndWallet(financialAsset, wallet).orElse(new UserInvestment());
        if(userInvestment.getId() == null){
            userInvestment.setAvaragePrice(financialAsset.getCurrentPrice());
            userInvestment.setQuantity(quantity);
            userInvestment.setWallet(wallet);
            userInvestment.setFinancialAsset(financialAsset);
            userInvestment.setCreatedAt(LocalDateTime.now());
        }else{
            BigDecimal totalInvested = userInvestment.getQuantity().multiply(userInvestment.getAvaragePrice());
            userInvestment.setQuantity(userInvestment.getQuantity().add(quantity));
            BigDecimal avaragePrice = totalInvested.add(quantity.multiply(financialAsset.getCurrentPrice())).divide(userInvestment.getQuantity(), 2, RoundingMode.HALF_UP);
            userInvestment.setAvaragePrice(avaragePrice);
        }

        userInvestimentRepository.save(userInvestment);
        
        return true;

    }

    
}
