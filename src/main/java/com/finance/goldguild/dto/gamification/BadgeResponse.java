package com.finance.goldguild.dto.gamification;

import com.finance.goldguild.models.BadgeType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BadgeResponse {
    private BadgeType badgeType;
    private LocalDateTime earnedAt;
}
