package com.finance.goldguild.repository;

import com.finance.goldguild.models.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExpenseRepo extends JpaRepository<Expense,Long> {
}
