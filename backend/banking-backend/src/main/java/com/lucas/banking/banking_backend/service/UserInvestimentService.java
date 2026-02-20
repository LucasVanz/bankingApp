package com.lucas.banking.banking_backend.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lucas.banking.banking_backend.dto.UserInvestmentDTO;
import com.lucas.banking.banking_backend.entity.FinancialAsset;
import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.entity.UserInvestment;
import com.lucas.banking.banking_backend.entity.Wallet;
import com.lucas.banking.banking_backend.repository.UserInvestimentRepository;

@Service
public class UserInvestimentService {
    
    @Autowired
    UserInvestimentRepository userInvestimentRepository;

    @Autowired
    WalletService walletService;

    // Compra o ativo
    public boolean buyAsset(Wallet wallet, FinancialAsset financialAsset, BigDecimal quantity){
        UserInvestment userInvestment = userInvestimentRepository.findByFinancialAssetAndWallet(financialAsset, wallet).orElse(new UserInvestment());
        // Verifica se ja existe o ativo na carteira
        if(userInvestment.getId() == null){
            userInvestment.setAvaragePrice(financialAsset.getCurrentPrice());
            userInvestment.setQuantity(quantity);
            userInvestment.setWallet(wallet);
            userInvestment.setFinancialAsset(financialAsset);
            userInvestment.setCreatedAt(LocalDateTime.now());
        }else{
            // Recalcula o preço médio e quantidade
            BigDecimal totalInvested = userInvestment.getQuantity().multiply(userInvestment.getAvaragePrice());
            userInvestment.setQuantity(userInvestment.getQuantity().add(quantity));
            BigDecimal avaragePrice = totalInvested.add(quantity.multiply(financialAsset.getCurrentPrice())).divide(userInvestment.getQuantity(), 2, RoundingMode.HALF_UP);
            userInvestment.setAvaragePrice(avaragePrice);
        }
        userInvestimentRepository.save(userInvestment);
        return true;
    }
    // Pega todos os investimentos do usuário
    public List<UserInvestmentDTO> getAllUserInvestment(User user){
        Wallet wallet = walletService.findByUser(user);
        BigDecimal proftability = new BigDecimal(0);
        List<UserInvestment> allUserInvestments = userInvestimentRepository.findAllByWallet(wallet).get();
        List<UserInvestmentDTO> investmentList = new ArrayList<>();
        // Varre os investimentos do usuário
        for (UserInvestment userInvestment : allUserInvestments) {
            // Se o preço médio e o preço corrente forem iguais, a rentabilidade é zero
            if (userInvestment.getAvaragePrice().equals(userInvestment.getFinancialAsset().getCurrentPrice())){
                proftability = new BigDecimal(0);
            }else{
                // Calcula a rentabilidade
                proftability = (((userInvestment.getFinancialAsset().getCurrentPrice()
                .multiply(userInvestment.getQuantity()))
                .subtract(userInvestment.getAvaragePrice()
                .multiply(userInvestment.getQuantity())))
                .divide(userInvestment.getAvaragePrice()
                .multiply(userInvestment.getQuantity()), 4, RoundingMode.HALF_UP)).multiply(new BigDecimal(100));
            }
            // Adiciona o elemento na lista de investimentos que será retornada na tela    
            investmentList.add(new UserInvestmentDTO(
                userInvestment.getFinancialAsset().getName(), 
                userInvestment.getFinancialAsset().getTicker(), 
                userInvestment.getFinancialAsset().getType(),
                userInvestment.getFinancialAsset().getCurrentPrice(),
                userInvestment.getFinancialAsset().getYieldPercentage(),
                userInvestment.getQuantity(),
                userInvestment.getAvaragePrice(),
                proftability
            ));
        }
        return investmentList;
    } 
}
