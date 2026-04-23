package com.lucas.banking.banking_backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lucas.banking.banking_backend.entity.FinancialAsset;
import com.lucas.banking.banking_backend.entity.FinancialAssetType;
import com.lucas.banking.banking_backend.entity.UserInvestment;
import com.lucas.banking.banking_backend.entity.Wallet;


@Repository
public interface UserInvestimentRepository extends JpaRepository<UserInvestment, UUID>{
    
    Optional<UserInvestment> findByFinancialAssetAndWallet(FinancialAsset financialAsset, Wallet wallet);
    Optional<List<UserInvestment>> findAllByWallet(Wallet wallet);
    @Query("SELECT ui FROM user_investiment ui WHERE ui.financialAsset.type = :type")
    List<UserInvestment> findByFinancialAssetType(@Param("type") FinancialAssetType type);
    
} 
