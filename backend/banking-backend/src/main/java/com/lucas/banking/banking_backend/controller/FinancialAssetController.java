package com.lucas.banking.banking_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.RestController;

import com.lucas.banking.banking_backend.dto.FinancialAssetDTO;
import com.lucas.banking.banking_backend.entity.User;
import com.lucas.banking.banking_backend.service.FinancialAssetService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@RestController
@RequestMapping("/financialAssets")
public class FinancialAssetController {
    
    @Autowired
    FinancialAssetService financialAssetService;


    @GetMapping("/homebroker")
    public ResponseEntity<List<FinancialAssetDTO>> getFinancialAssets(@AuthenticationPrincipal User user){
        return ResponseEntity.ok(financialAssetService.getAllAssets());
    }
}
