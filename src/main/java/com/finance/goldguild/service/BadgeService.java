package com.finance.goldguild.service;

import com.finance.goldguild.models.Badge;
import com.finance.goldguild.models.BadgeType;
import com.finance.goldguild.models.User;
import com.finance.goldguild.repository.BadgeRepo;
import com.finance.goldguild.repository.SavingGoalRepo;
import com.finance.goldguild.repository.UserRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.function.BooleanSupplier;

@Slf4j
@Service
@AllArgsConstructor
public class BadgeService {

    private final BadgeRepo badgeRepo;
    private final UserRepo userRepo;
    private final SavingGoalRepo savingGoalRepo;

    public void checkAndAwardBadges(User user) {
        awardIfNotExists(user, BadgeType.FIRST_EXPENSE,
                () -> user.getXp() >= GamificationService.XP_EXPENSE_ADDED);

        awardIfNotExists(user, BadgeType.FIRST_GOAL,
                () -> savingGoalRepo.findByUser(user).size() >= 1);

        awardIfNotExists(user, BadgeType.GOAL_COMPLETED,
                () -> savingGoalRepo.findByUserAndIsCompleted(user, true).size() >= 1);

        awardIfNotExists(user, BadgeType.STREAK_7,
                () -> user.getStreakCount() >= 7);

        awardIfNotExists(user, BadgeType.STREAK_30,
                () -> user.getStreakCount() >= 30);

        awardIfNotExists(user, BadgeType.LEVEL_5,
                () -> user.getLevel() >= 5);

        awardIfNotExists(user, BadgeType.XP_1000,
                () -> user.getXp() >= 1000);
    }

    private void awardIfNotExists(User user, BadgeType type, BooleanSupplier condition) {
        boolean alreadyHas = badgeRepo.existsByUserAndBadgeType(user, type);
        if (!alreadyHas && condition.getAsBoolean()) {
            Badge badge = new Badge();
            badge.setUser(user);
            badge.setBadgeType(type);
            badgeRepo.save(badge);
            log.info("Badge awarded to {} → {}", user.getEmail(), type);
        }
    }
}
