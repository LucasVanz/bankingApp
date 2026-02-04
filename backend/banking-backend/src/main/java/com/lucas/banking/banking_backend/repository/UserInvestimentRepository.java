package com.lucas.banking.banking_backend.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lucas.banking.banking_backend.entity.FinancialAsset;
import com.lucas.banking.banking_backend.entity.UserInvestment;
import com.lucas.banking.banking_backend.entity.Wallet;


@Repository
public interface UserInvestimentRepository extends JpaRepository<UserInvestment, UUID>{
    
    Optional<UserInvestment> findByFinancialAssetAndWallet(FinancialAsset financialAsset, Wallet wallet);
    
} 
