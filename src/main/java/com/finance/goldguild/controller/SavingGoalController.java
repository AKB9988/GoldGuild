package com.finance.goldguild.controller;

import com.finance.goldguild.dto.goal.ContributeRequest;
import com.finance.goldguild.dto.goal.GoalRequest;
import com.finance.goldguild.dto.goal.GoalResponse;
import com.finance.goldguild.service.SavingGoalService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@AllArgsConstructor
public class SavingGoalController {
    private final SavingGoalService service;
    @PostMapping
    public ResponseEntity<GoalResponse> createGoal(@RequestBody GoalRequest request)
    {
        String email= SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createGoal(request,email));
    }
    @GetMapping
    public ResponseEntity<List<GoalResponse>> getGoals()
    {
        String email =SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.status(HttpStatus.OK).body(service.getGoal(email));
    }
    @PutMapping("/{id}/contribute")
    public ResponseEntity<GoalResponse> contributeToGoal(@PathVariable long id, @RequestBody ContributeRequest request)
    {
        String email=SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.ok(service.contributeToGoal(id, request.getAmount(), email));
    }
    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable long id)
    {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        service.deleteGoal(id,email);
        return ResponseEntity.ok("Goal Deleted");
    }

}
