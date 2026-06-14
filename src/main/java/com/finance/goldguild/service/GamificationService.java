package com.finance.goldguild.service;

import com.finance.goldguild.models.User;
import com.finance.goldguild.repository.UserRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@AllArgsConstructor
public class GamificationService {


    public static final int XP_EXPENSE_ADDED     = 10;
    public static final int XP_GOAL_CONTRIBUTED  = 20;
    public static final int XP_GOAL_COMPLETED    = 100;
    public static final int XP_BUDGET_MAINTAINED = 50;

    private static final int XP_PER_LEVEL = 500;

    private final UserRepo userRepo;

    public void awardXP(User user, int xpAmount)
    {
        int oldLevel = user.getLevel();
        user.setXp(user.getXp() + xpAmount);
        recalculateLevel(user);
        userRepo.save(user);

        log.info("User {} earned {} XP  →  total {} XP  (level {}{})",
                user.getEmail(), xpAmount, user.getXp(), user.getLevel(),
                user.getLevel() > oldLevel ? " ⬆ LEVEL UP!" : "");
    }

    private void recalculateLevel(User user)
    {
        user.setLevel((user.getXp() / XP_PER_LEVEL) + 1);
    }
}
