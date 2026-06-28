package com.finance.goldguild.service;

import com.finance.goldguild.dto.budget.BudgetRequest;
import com.finance.goldguild.dto.budget.BudgetResponse;
import com.finance.goldguild.dto.budget.BudgetStatusResponse;
import com.finance.goldguild.models.Budget;
import com.finance.goldguild.models.Expense;
import com.finance.goldguild.models.User;
import com.finance.goldguild.repository.BudgetRepo;
import com.finance.goldguild.repository.ExpenseRepo;
import com.finance.goldguild.repository.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@AllArgsConstructor
public class BudgetService {

    private final BudgetRepo budgetRepo;
    private final ExpenseRepo expenseRepo;
    private final UserRepo userRepo;

    public BudgetResponse setBudget(BudgetRequest request, String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Budget budget = budgetRepo
                .findByUserAndCategoryAndMonth(user, request.getCategory(), request.getMonth())
                .orElse(new Budget());

        budget.setUser(user);
        budget.setCategory(request.getCategory());
        budget.setLimitAmount(request.getLimitAmount());
        budget.setMonth(request.getMonth());
        budgetRepo.save(budget);

        return mapToResponse(budget);
    }

    public List<BudgetStatusResponse> getBudgetStatus(String email, String month) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Budget> budgets = budgetRepo.findByUser(user);
        List<Expense> expenses = expenseRepo.findByUser(user);
        List<BudgetStatusResponse> result = new ArrayList<>();

        for (Budget budget : budgets) {
            if (month != null && !budget.getMonth().equals(month)) {
                continue;
            }

            BigDecimal spent = BigDecimal.ZERO;
            for (Expense expense : expenses) {
                if (expense.getDate() == null) continue;
                boolean sameCategory = expense.getCategory() == budget.getCategory();
                boolean sameMonth = toYearMonth(expense).equals(budget.getMonth());
                if (sameCategory && sameMonth) {
                    spent = spent.add(expense.getAmount());
                }
            }

            BigDecimal remaining = budget.getLimitAmount().subtract(spent);

            result.add(new BudgetStatusResponse(
                    budget.getId(),
                    budget.getCategory(),
                    budget.getLimitAmount(),
                    spent,
                    remaining,
                    budget.getMonth()
            ));
        }

        return result;
    }

    private String toYearMonth(Expense expense) {
        return String.format("%d-%02d",
                expense.getDate().getYear(),
                expense.getDate().getMonthValue());
    }

    private BudgetResponse mapToResponse(Budget budget) {
        return new BudgetResponse(
                budget.getId(),
                budget.getCategory(),
                budget.getLimitAmount(),
                budget.getMonth()
        );
    }
}
