package com.finance.goldguild.dto.gamification;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GamificationProfileResponse {
    private int xp;
    private int level;
    private int streakCount;
    private List<BadgeResponse> badges;
}
