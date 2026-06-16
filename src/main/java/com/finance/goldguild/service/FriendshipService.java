package com.finance.goldguild.service;

import com.finance.goldguild.dto.friendship.FriendshipResponse;
import com.finance.goldguild.models.FriendStatus;
import com.finance.goldguild.models.Friendship;
import com.finance.goldguild.models.User;
import com.finance.goldguild.repository.FriendshipRepo;
import com.finance.goldguild.repository.UserRepo;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class FriendshipService {

    private final FriendshipRepo friendshipRepo;
    private final UserRepo       userRepo;

    public FriendshipResponse sendRequest(String senderEmail, String targetUsername) {
        User sender = findUserByEmail(senderEmail);
        User target = userRepo.findByUsername(targetUsername)
                .orElseThrow(() -> new IllegalArgumentException(
                        "User not found: " + targetUsername));

        if (sender.getId() == target.getId()) {
            throw new IllegalArgumentException("Can't send friend request to yourself.");
        }

        if (friendshipRepo.existsByUserAndFriend(sender, target) ||
            friendshipRepo.existsByUserAndFriend(target, sender)) {
            throw new IllegalArgumentException("Friend request already exists");
        }

        Friendship friendship = new Friendship();
        friendship.setUser(sender);
        friendship.setFriend(target);
        friendship.setStatus(FriendStatus.PENDING);
        friendshipRepo.save(friendship);

        log.info("{} sent friend request to {}", sender.getUsername(), target.getUsername());
        return toResponse(friendship, target);
    }

    public FriendshipResponse acceptRequest(String receiverEmail, Long friendshipId) {
        User receiver = findUserByEmail(receiverEmail);
        Friendship friendship = findFriendshipById(friendshipId);
        validateReceiver(friendship, receiver);
        validatePending(friendship);

        friendship.setStatus(FriendStatus.ACCEPTED);
        friendshipRepo.save(friendship);

        log.info("{} accepted friend request #{}", receiver.getUsername(), friendshipId);
        return toResponse(friendship, friendship.getUser());
    }

    public FriendshipResponse rejectRequest(String receiverEmail, Long friendshipId) {
        User receiver = findUserByEmail(receiverEmail);
        Friendship friendship = findFriendshipById(friendshipId);
        validateReceiver(friendship, receiver);
        validatePending(friendship);

        friendship.setStatus(FriendStatus.REJECTED);
        friendshipRepo.save(friendship);

        log.info("{} rejected friend request #{}", receiver.getUsername(), friendshipId);
        return toResponse(friendship, friendship.getUser());
    }

    public List<FriendshipResponse> getPendingRequests(String email) {
        User user = findUserByEmail(email);
        List<Friendship> pending = friendshipRepo.findByFriendAndStatus(user, FriendStatus.PENDING);

        List<FriendshipResponse> result = new ArrayList<>();
        for (Friendship f : pending) {
            result.add(toResponse(f, f.getUser()));
        }
        return result;
    }

    public List<FriendshipResponse> getFriends(String email) {
        User user = findUserByEmail(email);

        List<Friendship> sentAccepted     = friendshipRepo.findByUserAndStatus(user, FriendStatus.ACCEPTED);
        List<Friendship> receivedAccepted = friendshipRepo.findByFriendAndStatus(user, FriendStatus.ACCEPTED);

        List<FriendshipResponse> result = new ArrayList<>();
        for (Friendship f : sentAccepted) {
            result.add(toResponse(f, f.getFriend()));
        }
        for (Friendship f : receivedAccepted) {
            result.add(toResponse(f, f.getUser()));
        }
        return result;
    }

    private User findUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private Friendship findFriendshipById(Long id) {
        return friendshipRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));
    }

    private void validateReceiver(Friendship friendship, User receiver) {
        if (friendship.getFriend().getId() != receiver.getId()) {
            throw new IllegalArgumentException("This request is not for you.");
        }
    }

    private void validatePending(Friendship friendship) {
        if (friendship.getStatus() != FriendStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Request already " + friendship.getStatus().name().toLowerCase());
        }
    }

    private FriendshipResponse toResponse(Friendship f, User displayUser) {
        return new FriendshipResponse(
                f.getId(),
                displayUser.getUsername(),
                f.getStatus(),
                f.getCreatedAt()
        );
    }
}
