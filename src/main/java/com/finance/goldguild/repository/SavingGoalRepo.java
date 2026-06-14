package com.finance.goldguild.repository;

import com.finance.goldguild.models.SavingGoal;
import com.finance.goldguild.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SavingGoalRepo extends JpaRepository<SavingGoal,Long> {
    List<SavingGoal> findByUser(User user);
    List<SavingGoal> findByUserAndIsCompleted(User user,boolean isCompleted);
}
