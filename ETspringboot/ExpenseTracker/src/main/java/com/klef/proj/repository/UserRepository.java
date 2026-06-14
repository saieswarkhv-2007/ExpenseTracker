package com.klef.proj.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.klef.proj.entity.*;

public interface UserRepository
        extends JpaRepository<User, Long>{

    User findByEmail(String email);
}