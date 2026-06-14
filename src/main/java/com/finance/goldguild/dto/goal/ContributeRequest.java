package com.finance.goldguild.dto.goal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ContributeRequest {
    private BigDecimal amount;
}
