package com.finance.goldguild.dto.expense;

import com.finance.goldguild.models.Category;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class ExpenseResponse {
    private long id;
    private BigDecimal amount;
    private Category category;
    private String note;
    private LocalDate date;
    private LocalDateTime createdAt;
}
