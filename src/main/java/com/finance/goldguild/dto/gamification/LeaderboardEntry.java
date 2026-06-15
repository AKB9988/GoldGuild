package com.finance.goldguild.dto.gamification;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardEntry {
    private int    rank;
    private String username;
    private int    xp;
    private int    level;
}
