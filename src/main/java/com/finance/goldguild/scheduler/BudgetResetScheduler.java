package com.finance.goldguild.scheduler;

import com.finance.goldguild.models.Budget;
import com.finance.goldguild.repository.BudgetRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
@AllArgsConstructor
@Slf4j
public class BudgetResetScheduler {

    private final BudgetRepo budgetRepo;
    
    @Scheduled(cron = "0 0 0 1 * *")
    public void createNextMonthBudgets() {
        log.info("Running monthly budget reset...");

        String currentMonth = LocalDate.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM"));

        List<Budget> currentBudgets = budgetRepo.findByMonth(currentMonth);
        String nextMonth = LocalDate.now()
                .plusMonths(1)
                .format(DateTimeFormatter.ofPattern("yyyy-MM"));

        for (Budget budget : currentBudgets) {
            Budget newBudget = new Budget();
            newBudget.setUser(budget.getUser());
            newBudget.setCategory(budget.getCategory());
            newBudget.setLimitAmount(budget.getLimitAmount());
            newBudget.setMonth(nextMonth);
            budgetRepo.save(newBudget);
            log.info("Budget created for next month: {}", budget.getCategory());
        }
        log.info("Monthly budget reset complete.");
    }
}
