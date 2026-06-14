package com.klef.proj.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.klef.proj.entity.Role;
import com.klef.proj.repository.RoleRepository;
import com.klef.proj.entity.User;
import com.klef.proj.repository.UserRepository;
import com.klef.proj.security.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin("*")
public class AuthController
{
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public String register(
            @RequestBody User user)
    {
        user.setPassword(
                passwordEncoder.encode(
                        user.getPassword()
                )
        );

        if (user.getRole() != null) {
            String roleName = user.getRole().getName();
            Role dbRole = null;
            if (user.getRole().getId() != null) {
                dbRole = roleRepository.findById(user.getRole().getId()).orElse(null);
            }
            if (dbRole == null && roleName != null) {
                dbRole = roleRepository.findByName(roleName.toUpperCase());
            }
            if (dbRole == null) {
                dbRole = roleRepository.findById(1L).orElse(null);
            }
            user.setRole(dbRole);
        } else {
            user.setRole(roleRepository.findById(1L).orElse(null));
        }

        userRepository.save(user);

        return "User Registered Successfully";
    }

    @PostMapping("/login")
    public Map<String,String> login(
            @RequestBody User request)
    {
        User user =
                userRepository.findByEmail(
                        request.getEmail()
                );

        if(user == null)
        {
            throw new RuntimeException(
                    "User Not Found"
            );
        }

        boolean valid =
                passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                );

        if(!valid)
        {
            throw new RuntimeException(
                    "Invalid Password"
            );
        }

        String token =
                jwtUtil.generateToken(
                        user.getEmail()
                );

        Map<String,String> response =
                new HashMap<>();

        response.put("token", token);
        response.put("id", String.valueOf(user.getId()));
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole() != null ? user.getRole().getName() : "USER");

        return response;
    }
}