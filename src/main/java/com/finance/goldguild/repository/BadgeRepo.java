package com.finance.goldguild.repository;

import com.finance.goldguild.models.Badge;
import com.finance.goldguild.models.BadgeType;
import com.finance.goldguild.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BadgeRepo extends JpaRepository<Badge,Long> {
    List<Badge> findByUser(User user);
    boolean existsByUserAndBadgeType(User user, BadgeType badgeType);
}
