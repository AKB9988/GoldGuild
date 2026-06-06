package com.finance.goldguild.repository;

import com.finance.goldguild.models.SavingGoal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavingGoalRepo extends JpaRepository<SavingGoal,Long> {
}
