package com.finance.goldguild.repository;

import com.finance.goldguild.models.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FriendshipRepo extends JpaRepository<Friendship,Long> {
}
