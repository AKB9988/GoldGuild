package com.finance.goldguild.controller;

import com.finance.goldguild.dto.gamification.GamificationProfileResponse;
import com.finance.goldguild.dto.gamification.LeaderboardEntry;
import com.finance.goldguild.service.GamificationService;
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

    private final GamificationService gamificationService;

    @GetMapping("/profile")
    public ResponseEntity<GamificationProfileResponse> getProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(gamificationService.getProfile(email));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntry>> getLeaderboard() {
        return ResponseEntity.ok(gamificationService.getLeaderboard());
    }
}
