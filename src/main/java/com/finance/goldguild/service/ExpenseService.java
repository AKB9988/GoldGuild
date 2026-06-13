package com.finance.goldguild.service;

import com.finance.goldguild.dto.expense.ExpenseRequest;
import com.finance.goldguild.dto.expense.ExpenseResponse;
import com.finance.goldguild.models.Expense;
import com.finance.goldguild.models.User;
import com.finance.goldguild.repository.ExpenseRepo;
import com.finance.goldguild.repository.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;

@Service
@AllArgsConstructor
public class ExpenseService {
    private final ExpenseRepo expenseRepo;
    private final UserRepo userRepo;
    public ExpenseResponse addExpense(ExpenseRequest request, String email)
    {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Expense expense = new Expense();
        expense.setAmount(request.getAmount());
        expense.setNote(request.getNote());
        expense.setCategory(request.getCategory());
        expense.setDate(request.getDate());
        expense.setUser(user);
        expenseRepo.save(expense);

        return mapToResponse(expense);
    }
    public List<ExpenseResponse> getExpenses(String email)
    {
        User user = userRepo.findByEmail(email).orElseThrow(()->new IllegalArgumentException("User not found"));
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
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Expense expense = expenseRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));
        if (expense.getUser().getId() != user.getId()) {
            throw new IllegalArgumentException("You are not authorized to delete this expense");
        }
        expenseRepo.delete(expense);
    }

    public ExpenseResponse updateExpense(Long id, ExpenseRequest request, String email)
    {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Expense expense = expenseRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Expense not found"));
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

    public ExpenseResponse getExpense(long id) {
       Expense expense= expenseRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Expense not found"));
       return mapToResponse(expense);
    }

    public List<ExpenseResponse> getExpensesByMonth(String email, String month) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
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
