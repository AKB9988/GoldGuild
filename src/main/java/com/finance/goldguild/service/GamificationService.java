package com.finance.goldguild.service;

import com.finance.goldguild.dto.gamification.BadgeResponse;
import com.finance.goldguild.dto.gamification.GamificationProfileResponse;
import com.finance.goldguild.dto.gamification.LeaderboardEntry;
import com.finance.goldguild.models.Badge;
import com.finance.goldguild.models.User;
import com.finance.goldguild.repository.BadgeRepo;
import com.finance.goldguild.repository.UserRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@AllArgsConstructor
public class GamificationService {


    public static final int XP_EXPENSE_ADDED     = 10;
    public static final int XP_GOAL_CONTRIBUTED  = 20;
    public static final int XP_GOAL_COMPLETED    = 100;
    public static final int XP_BUDGET_MAINTAINED = 50;

    private static final int XP_PER_LEVEL = 500;

    private final UserRepo      userRepo;
    private final BadgeRepo     badgeRepo;
    private final BadgeService  badgeService;

    public void awardXP(User user, int xpAmount)
    {
        int oldLevel = user.getLevel();
        user.setXp(user.getXp() + xpAmount);
        recalculateLevel(user);
        userRepo.save(user);

        log.info("User {} earned {} XP  →  total {} XP  (level {}{})",
                user.getEmail(), xpAmount, user.getXp(), user.getLevel(),
                user.getLevel() > oldLevel ? " ⬆ LEVEL UP!" : "");

        badgeService.checkAndAwardBadges(user);
    }

    public GamificationProfileResponse getProfile(String email)
    {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Badge> badges = badgeRepo.findByUser(user);

        List<BadgeResponse> badgeResponses = badges.stream()
                .map(b -> new BadgeResponse(b.getBadgeType(), b.getEarnedAt()))
                .collect(Collectors.toList());

        return new GamificationProfileResponse(
                user.getXp(),
                user.getLevel(),
                user.getStreakCount(),
                badgeResponses
        );
    }

    public List<LeaderboardEntry> getLeaderboard() {
        List<User> users = userRepo.findAllByOrderByXpDesc();
        List<LeaderboardEntry> leaderboard = new ArrayList<>();
        int rank = 1;
        for (User user : users) {
            leaderboard.add(new LeaderboardEntry(
                    rank++,
                    user.getUsername(),
                    user.getXp(),
                    user.getLevel()
            ));
        }
        return leaderboard;
    }

    private void recalculateLevel(User user)
    {
        user.setLevel((user.getXp() / XP_PER_LEVEL) + 1);
    }
}
