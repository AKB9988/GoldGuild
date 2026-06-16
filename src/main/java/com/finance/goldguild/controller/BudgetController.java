package com.finance.goldguild.controller;

import com.finance.goldguild.dto.budget.BudgetRequest;
import com.finance.goldguild.dto.budget.BudgetResponse;
import com.finance.goldguild.dto.budget.BudgetStatusResponse;
import com.finance.goldguild.service.BudgetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {
    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    private String getAuthenticatedUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> setBudget(@Valid @RequestBody BudgetRequest budgetRequest) {
        String email = getAuthenticatedUserEmail();
        BudgetResponse response = budgetService.setBudget(budgetRequest, email);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/status")
    public ResponseEntity<List<BudgetStatusResponse>> getBudgetStatus(@RequestParam(required = false) String month) {
        String email = getAuthenticatedUserEmail();
        List<BudgetStatusResponse> status = budgetService.getBudgetStatus(email, month);
        return ResponseEntity.ok(status);
    }
}
