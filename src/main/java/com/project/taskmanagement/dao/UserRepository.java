package com.project.taskmanagement.dao;

import com.project.taskmanagement.modal.User;
import org.springframework.data.jpa.repository.JpaRepository;

// creating a user repo that works with User table
public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}

