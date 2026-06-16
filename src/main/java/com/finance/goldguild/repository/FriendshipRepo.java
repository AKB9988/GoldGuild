package com.finance.goldguild.repository;

import com.finance.goldguild.models.FriendStatus;
import com.finance.goldguild.models.Friendship;
import com.finance.goldguild.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FriendshipRepo extends JpaRepository<Friendship, Long> {

    Optional<Friendship> findByUserAndFriend(User user, User friend);

    List<Friendship> findByFriendAndStatus(User friend, FriendStatus status);

    List<Friendship> findByUserAndStatus(User user, FriendStatus status);

    boolean existsByUserAndFriend(User user, User friend);
}
