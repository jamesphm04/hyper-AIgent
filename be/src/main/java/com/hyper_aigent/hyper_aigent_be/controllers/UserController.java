package com.hyper_aigent.hyper_aigent_be.controllers;

import com.hyper_aigent.hyper_aigent_be.domain.dtos.user.LoginResponseDto;
import com.hyper_aigent.hyper_aigent_be.domain.dtos.user.UserDto;
import com.hyper_aigent.hyper_aigent_be.exceptions.UserAlreadyExistsException;
import com.hyper_aigent.hyper_aigent_be.services.interfaces.user.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserController {
    final private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping(path = "/api/v2/users/signup")
    public ResponseEntity<?> createUser(@RequestBody UserDto userDto) {
        System.out.println("Creating user: " + userDto);
        try {
            LoginResponseDto loginResponse = userService.signup(userDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(loginResponse);
        } catch (UserAlreadyExistsException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping(path = "/api/v2/users/login")
    public ResponseEntity<LoginResponseDto> login(@RequestBody UserDto userDto) {
        System.out.println("Logging in user: " + userDto);
        try {
            LoginResponseDto loginResponse = userService.login(userDto);
            System.out.println("Login response: " + loginResponse);
            return ResponseEntity.ok(loginResponse);
        } catch (Exception e) {
            System.out.println("Error logging in user: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping(path = "/api/v2/auth/logout")
    public ResponseEntity<?> logout() {
        // TODO: Add to blacklist
        return new ResponseEntity<>(HttpStatus.OK);
    }
}