package com.finance.goldguild.controller;

import com.finance.goldguild.dto.gamification.BadgeResponse;
import com.finance.goldguild.dto.gamification.GamificationProfileResponse;
import com.finance.goldguild.models.Badge;
import com.finance.goldguild.models.User;
import com.finance.goldguild.repository.BadgeRepo;
import com.finance.goldguild.repository.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/gamification")
@AllArgsConstructor
public class GamificationController {

    private final UserRepo  userRepo;
    private final BadgeRepo badgeRepo;

    @GetMapping("/profile")
    public ResponseEntity<GamificationProfileResponse> getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        List<Badge> badges = badgeRepo.findByUser(user);

        List<BadgeResponse> badgeResponses = new java.util.ArrayList<>();
        for (Badge b : badges) {
            badgeResponses.add(new BadgeResponse(b.getBadgeType(), b.getEarnedAt()));
        }

        GamificationProfileResponse response = new GamificationProfileResponse(
                user.getXp(),
                user.getLevel(),
                user.getStreakCount(),
                badgeResponses
        );

        return ResponseEntity.ok(response);
    }
}
