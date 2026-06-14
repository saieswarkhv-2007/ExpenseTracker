package com.klef.proj.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.klef.proj.entity.Expense;

public interface ExpenseRepository
        extends JpaRepository<Expense, Long>{

}