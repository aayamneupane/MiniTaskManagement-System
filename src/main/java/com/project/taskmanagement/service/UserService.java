package com.project.taskmanagement.service;

import com.project.taskmanagement.entity.User;
import com.project.taskmanagement.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getPassword().equals(user.getPassword())) {
            return user;
        }

        return null;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
