package com.lucas.banking.banking_backend.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lucas.banking.banking_backend.entity.FinancialAsset;
import com.lucas.banking.banking_backend.entity.FinancialAssetType;


@Repository
public interface FinancialAssetRepository extends JpaRepository<FinancialAsset, UUID>{
    Optional<FinancialAsset> findByTicker(String ticker);
    Optional<List<FinancialAsset>> findByType(FinancialAssetType type);
}
