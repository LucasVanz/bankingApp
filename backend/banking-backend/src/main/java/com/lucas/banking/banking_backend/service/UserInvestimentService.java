package com.lucas.banking.banking_backend.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lucas.banking.banking_backend.entity.FinancialAsset;
import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.entity.UserInvestment;
import com.lucas.banking.banking_backend.entity.Wallet;
import com.lucas.banking.banking_backend.repository.UserInvestimentRepository;
import com.lucas.banking.banking_backend.repository.WalletRepository;

@Service
public class UserInvestimentService {

    @Autowired
    FinancialAssetService financialAssetService;
    
    @Autowired
    UserInvestimentRepository userInvestimentRepository;

    @Autowired
    WalletService walletService;

    @Autowired
    WalletRepository walletRepository;

    public UserInvestment buyAsset(User user, String ticker, Long quantity){
        FinancialAsset financialAsset = financialAssetService.getAssetByTicker(ticker);
        Wallet wallet = walletService.findByUser(user);
        UserInvestment userInvestment = userInvestimentRepository.findByFinancialAssetAndWallet(financialAsset, wallet).orElse(new UserInvestment());
        if(userInvestment.getId() == null){
            userInvestment.setAvaragePrice(financialAsset.getCurrentPrice());
            userInvestment.setQuantity(quantity);
            userInvestment.setWallet(wallet);
            userInvestment.setFinancialAsset(financialAsset);
            userInvestment.setCreatedAt(LocalDateTime.now());
        }else{
            Double totalInvested = userInvestment.getQuantity() * userInvestment.getAvaragePrice();
            userInvestment.setQuantity(userInvestment.getQuantity() + quantity);
            Double avaragePrice = (totalInvested + (quantity * financialAsset.getCurrentPrice())) / userInvestment.getQuantity();
            userInvestment.setAvaragePrice(avaragePrice);
        }
        // TODO: chamar o metodo investmentTransaction

        userInvestimentRepository.save(userInvestment);
        
        return userInvestment;

    }
}
