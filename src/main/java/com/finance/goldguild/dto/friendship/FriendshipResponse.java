package com.finance.goldguild.dto.friendship;

import com.finance.goldguild.models.FriendStatus;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class FriendshipResponse {
    private Long   friendshipId;
    private String username;
    private FriendStatus status;
    private LocalDateTime createdAt;
}
