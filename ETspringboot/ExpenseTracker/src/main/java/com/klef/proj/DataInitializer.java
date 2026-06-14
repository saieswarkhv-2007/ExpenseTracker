package com.klef.proj;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.klef.proj.entity.Role;
import com.klef.proj.entity.User;
import com.klef.proj.repository.RoleRepository;
import com.klef.proj.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 1. Initialize Roles
        Role userRole = roleRepository.findById(1L).orElseGet(() -> {
            Role r = new Role(1L, "USER");
            return roleRepository.save(r);
        });

        Role adminRole = roleRepository.findById(2L).orElseGet(() -> {
            Role r = new Role(2L, "ADMIN");
            return roleRepository.save(r);
        });

        // 2. Map existing users with null roles to USER
        for (User user : userRepository.findAll()) {
            if (user.getRole() == null) {
                user.setRole(userRole);
                userRepository.save(user);
            }
        }

        // 3. Create default admin if not present
        if (userRepository.findByEmail("admin@expensetracker.com") == null) {
            User admin = new User();
            admin.setName("Admin User");
            admin.setEmail("admin@expensetracker.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(adminRole);
            userRepository.save(admin);
        }
    }
}
