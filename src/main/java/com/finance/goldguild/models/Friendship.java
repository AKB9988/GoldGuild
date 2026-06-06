package com.finance.goldguild.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name ="friendships")
public class Friendship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    @ManyToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "user-id")
    private User user;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="friend-id")
    private User friend;
    private FriendStatus status;
    @CreationTimestamp
    private LocalDateTime createdAt;
}
