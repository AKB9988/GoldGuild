package com.finance.goldguild.dto.friendship;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FriendRequest {

    @NotBlank(message = "Username is required")
    private String username;
}
