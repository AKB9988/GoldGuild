package com.finance.goldguild.service;

import com.finance.goldguild.dto.goal.GoalRequest;
import com.finance.goldguild.dto.goal.GoalResponse;
import com.finance.goldguild.models.SavingGoal;
import com.finance.goldguild.models.User;
import com.finance.goldguild.repository.SavingGoalRepo;
import com.finance.goldguild.repository.UserRepo;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class SavingGoalService {
    private final SavingGoalRepo savingGoalRepo;
    private final UserRepo userRepo;
    private final GamificationService gamificationService;

    public GoalResponse createGoal(GoalRequest request, String email)
    {
        User user=userRepo.findByEmail(email).orElseThrow(()->new IllegalArgumentException("User not found"));
        SavingGoal goal = new SavingGoal();
        goal.setName(request.getName());
        goal.setTargetAmount(request.getTargetAmount());
        goal.setDeadline(request.getDeadline());
        goal.setUser(user);
        savingGoalRepo.save(goal);
        return mapToResponse(goal);
    }
    public List<GoalResponse> getGoal(String email)
    {
        User user=userRepo.findByEmail(email).orElseThrow(()->new IllegalArgumentException("User not found"));
        List<SavingGoal> goals = savingGoalRepo.findByUser(user);
        List<GoalResponse> goalResponses=new ArrayList<>();
        for (SavingGoal goal:goals)
        {
            goalResponses.add(mapToResponse(goal));
        }
        return goalResponses;
    }
    public GoalResponse contributeToGoal(long id, BigDecimal amount,String email)
    {
        User user = userRepo.findByEmail(email).orElseThrow(()->new IllegalArgumentException("User not found"));
        SavingGoal goal =savingGoalRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Saving goal not found"));
        if(goal.getUser().getId()!=(user.getId()))
            throw new IllegalArgumentException("You do not have permission to contribute to this goal.");
        BigDecimal updatedAmount=goal.getCurrentAmount().add(amount);
        goal.setCurrentAmount(updatedAmount);
        if(goal.getCurrentAmount().compareTo(goal.getTargetAmount())>=0)
            goal.setCompleted(true);
        savingGoalRepo.save(goal);

        // Award 20 XP for contributing
        gamificationService.awardXP(user, GamificationService.XP_GOAL_CONTRIBUTED);

        // Award additional 100 XP if the goal just became completed
        if (goal.isCompleted()) {
            gamificationService.awardXP(user, GamificationService.XP_GOAL_COMPLETED);
        }

        return mapToResponse(goal);
    }
    public void deleteGoal(long id, String email)
    {
        User user = userRepo.findByEmail(email).orElseThrow(()->new IllegalArgumentException("User not found"));
        SavingGoal goal = savingGoalRepo.findById(id).orElseThrow(()->new IllegalArgumentException("Goal not found"));
        if(goal.getUser().getId() !=(user.getId()))
            throw new IllegalArgumentException("Not your goal");
        savingGoalRepo.deleteById(id);
    }
    private GoalResponse mapToResponse(SavingGoal goal)
    {
        return new GoalResponse(
                goal.getId(),
                goal.getName(),
                goal.getTargetAmount(),
                goal.getCurrentAmount(),
                goal.getDeadline(),
                goal.isCompleted()
        );
    }
}
