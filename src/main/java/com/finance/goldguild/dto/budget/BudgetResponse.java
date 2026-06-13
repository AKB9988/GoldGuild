package com.finance.goldguild.dto.budget;

import com.finance.goldguild.models.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetResponse {
    private long id;
    private Category category;
    private BigDecimal limitAmount;
    private String month;
}
