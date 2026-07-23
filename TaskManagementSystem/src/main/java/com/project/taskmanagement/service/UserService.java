package com.project.taskmanagement.service;

import com.project.taskmanagement.modal.User;
import com.project.taskmanagement.dao.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(User user) {
        // to avoid duplicate users
        User existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser != null) {
            return null;
        }

        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }

        return null;
    }

    public List<User> getAllUsers(Long actorId) {
        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login is required"));
        if (!"ADMIN".equalsIgnoreCase(actor.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access is required");
        }
        return userRepository.findAll();
    }
}
