package com.lucas.banking.banking_backend.repository;
import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface WalletRepository extends JpaRepository<Wallet, Long>{
    Optional<Wallet> findByUser(User user);
}
