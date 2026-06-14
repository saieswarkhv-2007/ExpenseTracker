package com.klef.proj.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.klef.proj.entity.Category;

public interface CategoryRepository
        extends JpaRepository<Category, Long>{

}