package com.project.taskmanagement.controller;

import com.project.taskmanagement.modal.User;
import com.project.taskmanagement.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public User login(@RequestBody User user) {
        return userService.loginUser(user.getEmail(), user.getPassword());
    }

    @GetMapping
    public List<User> getallUsers(@RequestHeader("X-User-Id") Long actorId) {
        return userService.getAllUsers(actorId);
    }

    @DeleteMapping("/{id}")
    public String deleteUser(@RequestHeader("X-User-Id") Long actorId,
                             @PathVariable Long id) {
        userService.deleteUser(actorId, id);
        return "User deleted successfully";
    }


}
