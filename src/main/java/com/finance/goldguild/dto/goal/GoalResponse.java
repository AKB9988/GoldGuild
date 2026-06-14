package com.finance.goldguild.dto.goal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoalResponse {
    Long id;
    String name;
    BigDecimal targetAmount;
    BigDecimal currentAmount;
    LocalDate deadline;
    boolean isCompleted;
    public int getProgressPercentage() {
        if (targetAmount == null || targetAmount.compareTo(BigDecimal.ZERO) == 0) {
            return 0;
        }
        if (currentAmount == null) {
            return 0;
        }

        // Equivalent to: (currentAmount / targetAmount) * 100
        return currentAmount
                .divide(targetAmount, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .intValue();
    }
}
