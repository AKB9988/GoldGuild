package com.finance.goldguild.repository;

import com.finance.goldguild.models.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import com.finance.goldguild.models.Category;
import com.finance.goldguild.models.User;
import java.util.List;
import java.util.Optional;

public interface BudgetRepo extends JpaRepository<Budget,Long> {
    List<Budget> findByUser(User user);
    Optional<Budget> findByUserAndCategoryAndMonth(User user, Category category, String month);
}
