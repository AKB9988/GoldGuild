package com.finance.goldguild.dto.expense;

import com.finance.goldguild.models.Category;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class ExpenseRequest {
    private BigDecimal amount;
    private Category category;
    private String note;
    private LocalDate date;
}
