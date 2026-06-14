package com.finance.goldguild.dto.xp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class XpResponse {
    private int totalXp;
    private int level;
    private int xpToNextLevel;
}
