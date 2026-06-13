package com.finance.goldguild.controller;

import com.finance.goldguild.dto.expense.ExpenseRequest;
import com.finance.goldguild.dto.expense.ExpenseResponse;
import com.finance.goldguild.service.ExpenseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {
    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    private String getAuthenticatedUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping
    public ResponseEntity<ExpenseResponse> saveExpense(@RequestBody ExpenseRequest expenseRequest) {
        String email = getAuthenticatedUserEmail();
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseService.addExpense(expenseRequest, email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseResponse> getExpense(@PathVariable long id) {
        return ResponseEntity.ok(expenseService.getExpense(id));
    }

    @GetMapping
    public ResponseEntity<List<ExpenseResponse>> getExpenses() {
        String email = getAuthenticatedUserEmail();
        return ResponseEntity.ok(expenseService.getExpenses(email));
    }

    @GetMapping("/month/{month}")
    public ResponseEntity<List<ExpenseResponse>> getExpensesByMonth(@PathVariable String month) {
        String email = getAuthenticatedUserEmail();
        return ResponseEntity.ok(expenseService.getExpensesByMonth(email, month));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        String email = getAuthenticatedUserEmail();
        expenseService.deleteExpense(id, email);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseResponse> update(@PathVariable long id, @RequestBody ExpenseRequest request) {
        String email = getAuthenticatedUserEmail();
        return ResponseEntity.ok(expenseService.updateExpense(id, request, email));
    }
}
