package com.finance.goldguild.repository;

import com.finance.goldguild.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User,Long> {
}
