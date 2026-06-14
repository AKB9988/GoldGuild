package com.finance.goldguild.scheduler;

import com.finance.goldguild.models.User;
import com.finance.goldguild.repository.UserRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@AllArgsConstructor
@Slf4j
public class StreakScheduler {

    private final UserRepo userRepo;

    @Scheduled(cron = "0 0 0 * * *")
    public void resetExpiredStreaks() {
        log.info("Running streak check...");
        List<User> users = userRepo.findAll();
        LocalDate yesterday = LocalDate.now().minusDays(1);

        for (User user : users) {
            if (user.getLastActiveDate() == null ||
                user.getLastActiveDate().isBefore(yesterday)) {
                user.setStreakCount(0);
                userRepo.save(user);
                log.info("Streak reset for user: {}", user.getEmail());
            }
        }
        log.info("Streak check complete.");
    }
}