package com.lucas.banking.banking_backend.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.lucas.banking.banking_backend.entity.UserInvestment;

@Repository
public interface UserInvestimentRepository extends JpaRepository<UserInvestment, UUID>{

    
} 
