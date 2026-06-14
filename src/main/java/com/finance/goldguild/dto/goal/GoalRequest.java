package com.finance.goldguild.dto.goal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GoalRequest {
    String name;
    BigDecimal targetAmount;
    LocalDate deadline;
}
