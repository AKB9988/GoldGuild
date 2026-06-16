package com.finance.goldguild.controller;

import com.finance.goldguild.dto.friendship.FriendRequest;
import com.finance.goldguild.dto.friendship.FriendshipResponse;
import com.finance.goldguild.service.FriendshipService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/friends")
@AllArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;

    private String currentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @PostMapping("/request")
    public ResponseEntity<FriendshipResponse> sendRequest(
            @Valid @RequestBody FriendRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(friendshipService.sendRequest(currentUserEmail(), request.getUsername()));
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<FriendshipResponse> acceptRequest(@PathVariable Long id) {
        return ResponseEntity.ok(friendshipService.acceptRequest(currentUserEmail(), id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<FriendshipResponse> rejectRequest(@PathVariable Long id) {
        return ResponseEntity.ok(friendshipService.rejectRequest(currentUserEmail(), id));
    }

    @GetMapping("/pending")
    public ResponseEntity<List<FriendshipResponse>> getPendingRequests() {
        return ResponseEntity.ok(friendshipService.getPendingRequests(currentUserEmail()));
    }

    @GetMapping
    public ResponseEntity<List<FriendshipResponse>> getFriends() {
        return ResponseEntity.ok(friendshipService.getFriends(currentUserEmail()));
    }
}
