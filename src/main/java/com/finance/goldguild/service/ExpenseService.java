package com.finance.goldguild.service;

import com.finance.goldguild.dto.expense.ExpenseRequest;
import com.finance.goldguild.dto.expense.ExpenseResponse;
import com.finance.goldguild.models.Expense;
import com.finance.goldguild.models.User;
import com.finance.goldguild.repository.ExpenseRepo;
import com.finance.goldguild.repository.UserRepo;
import jakarta.persistence.EntityNotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;


import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class ExpenseService {
    private final ExpenseRepo expenseRepo;
    private final UserRepo userRepo;
    private final GamificationService gamificationService;

    public ExpenseResponse addExpense(ExpenseRequest request, String email)
    {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Expense expense = new Expense();
        expense.setAmount(request.getAmount());
        expense.setNote(request.getNote());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setUser(user);
        expenseRepo.save(expense);

        LocalDate today = LocalDate.now();

        // only update streak once per day
        if (user.getLastActiveDate() == null || !user.getLastActiveDate().equals(today)) {
            // if they were active yesterday, continue the streak
            if (user.getLastActiveDate() != null && user.getLastActiveDate().equals(today.minusDays(1))) {
                user.setStreakCount(user.getStreakCount() + 1);
            } else {
                // missed a day, restart streak from 1
                user.setStreakCount(1);
            }
            user.setLastActiveDate(today);
        }

        userRepo.save(user);

        gamificationService.awardXP(user, GamificationService.XP_EXPENSE_ADDED);

        return mapToResponse(expense);
    }
    public List<ExpenseResponse> getExpenses(String email)
    {
        User user = userRepo.findByEmail(email).orElseThrow(()->new EntityNotFoundException("User not found"));
        List<Expense> expenses = expenseRepo.findByUser(user);
        List<ExpenseResponse> responseList = new java.util.ArrayList<>();
        for (Expense expense : expenses) {
            responseList.add(mapToResponse(expense));
        }
        return responseList;
    }
    public void deleteExpense(Long id, String email)
    {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Expense expense = expenseRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Expense not found"));
        if (expense.getUser().getId() != user.getId()) {
            throw new IllegalArgumentException("You are not authorized to delete this expense");
        }
        expenseRepo.delete(expense);
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, String email)
    {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        Expense expense = expenseRepo.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Expense not found"));
        if (expense.getUser().getId() != user.getId()) {
            throw new IllegalArgumentException("You are not authorized to update this expense");
        }
        expense.setAmount(request.getAmount());
        expense.setNote(request.getNote());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expenseRepo.save(expense);
        return mapToResponse(expense);
    }
    private ExpenseResponse mapToResponse(Expense expense) {
        return new ExpenseResponse(
                expense.getId(),
                expense.getAmount(),
                expense.getCategory(),
                expense.getNote(),
                expense.getDate(),
                expense.getCreatedAt()
        );
    }

    public ExpenseResponse getExpense(long id, String email) {
        User user = userRepo.findByEmail(email).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Expense expense = expenseRepo.findById(id).orElseThrow(() -> new EntityNotFoundException("Expense not found"));
        if (expense.getUser().getId() != user.getId()) {
            throw new IllegalArgumentException("You are not authorized to view this expense");
        }
        return mapToResponse(expense);
    }

    public List<ExpenseResponse> getExpensesByMonth(String email, String month) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
        List<Expense> expenses = expenseRepo.findByUser(user);
        List<ExpenseResponse> responseList = new java.util.ArrayList<>();
        for (Expense expense : expenses) {
            if (expense.getDate() != null) {
                String monthValStr = String.valueOf(expense.getDate().getMonthValue());
                String monthValStrZero = String.format("%02d", expense.getDate().getMonthValue());
                String monthName = expense.getDate().getMonth().name();
                String yearMonth = expense.getDate().getYear() + "-" + monthValStrZero;

                if (month.equalsIgnoreCase(monthValStr) ||
                    month.equalsIgnoreCase(monthValStrZero) ||
                    month.equalsIgnoreCase(monthName) ||
                    month.equals(yearMonth)) {
                    responseList.add(mapToResponse(expense));
                }
            }
        }
        return responseList;
    }
}
