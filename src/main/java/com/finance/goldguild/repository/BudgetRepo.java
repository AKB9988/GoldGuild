package com.finance.goldguild.repository;

import com.finance.goldguild.models.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BudgetRepo extends JpaRepository<Budget,Long> {
}
