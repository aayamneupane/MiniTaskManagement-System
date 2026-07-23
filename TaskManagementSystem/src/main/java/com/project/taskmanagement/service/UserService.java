package com.project.taskmanagement.service;

import com.project.taskmanagement.modal.User;
import com.project.taskmanagement.dao.UserRepository;
import com.project.taskmanagement.dao.TicketRepository;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;

    public UserService(UserRepository userRepository, TicketRepository ticketRepository) {
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
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

    public void deleteUser(Long actorId, Long userId) {
        User actor = userRepository.findById(actorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Login is required"));

        if (!"ADMIN".equalsIgnoreCase(actor.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only an admin can delete users");
        }
        if (actorId.equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admins cannot delete themselves");
        }

        User userToDelete = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if ("ADMIN".equalsIgnoreCase(userToDelete.getRole())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin accounts cannot be deleted here");
        }
        if (!ticketRepository.findByAssignedUserId(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Reassign or delete this user's tickets before deleting the user");
        }

        userRepository.delete(userToDelete);
    }
}
