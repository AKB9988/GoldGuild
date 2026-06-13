package com.finance.goldguild.service;

import com.finance.goldguild.dto.auth.AuthResponse;
import com.finance.goldguild.dto.auth.LoginRequest;
import com.finance.goldguild.dto.auth.RegisterRequest;
import com.finance.goldguild.models.User;
import com.finance.goldguild.repository.UserRepo;
import com.finance.goldguild.security.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {
    private final UserRepo userRepo;
    private final PasswordEncoder passwordEncoder;
    private  final JwtUtil jwtUtil;
    public AuthResponse register(RegisterRequest request)
    {
        if(userRepo.existsByEmail(request.getEmail()))
            throw new IllegalArgumentException("User already exists.");
        User user=new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setName(request.getName() != null ? request.getName() : request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        userRepo.save(user);
        String token =jwtUtil.generateToken(request.getEmail());
        return new AuthResponse(token);
    }
    public AuthResponse login(LoginRequest request)
    {
        User user = userRepo.findByEmail(request.getEmail()).orElseThrow(()-> new IllegalArgumentException("User not found"));
        if(!passwordEncoder.matches(request.getPassword(),user.getPassword()))
            throw new IllegalArgumentException("Wrong password");
        String token =jwtUtil.generateToken(request.getEmail());
        return new AuthResponse(token);
    }

}
