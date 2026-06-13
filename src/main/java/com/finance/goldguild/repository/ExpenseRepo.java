package com.finance.goldguild.repository;

import com.finance.goldguild.models.Expense;
import com.finance.goldguild.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepo extends JpaRepository<Expense,Long> {
    List<Expense> findByUser(User user);
}
