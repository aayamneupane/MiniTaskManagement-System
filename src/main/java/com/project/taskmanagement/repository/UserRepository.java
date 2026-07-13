package com.project.taskmanagement.repository;

import com.project.taskmanagement.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

// creating a user repo that works with User table
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}

