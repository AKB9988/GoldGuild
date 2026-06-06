package com.finance.goldguild.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;


@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name="saving-goals")
public class SavingGoal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    private String name;
    private BigDecimal targetAmount;
    private BigDecimal currentAmount = BigDecimal.ZERO;
    private LocalDate deadline;
    private boolean isCompleted = false;
}
