package org.example.product.Controller;

import org.example.product.User;
import org.example.product.UserRole;
import org.example.product.repo.UserRepository;
import org.example.product.security.JwtUtils;
import org.example.product.service.EmailService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, 
                          EmailService emailService, 
                          AuthenticationManager authenticationManager, 
                          JwtUtils jwtUtils, 
                          UserDetailsService userDetailsService,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public Map<String, String> register(
            @RequestParam String email,
            @RequestParam String password,
            @RequestParam String role) {

        Map<String, String> response = new HashMap<>();

        User existing = userRepository.findByEmail(email);
        if (existing != null) {
            response.put("error", "Email already in use");
            return response;
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password)); // Encode password
        user.setName(email.split("@")[0]);
        
        try {
            user.setRole(UserRole.valueOf(role.toUpperCase()));
        } catch (IllegalArgumentException e) {
            user.setRole(UserRole.CLIENT);
        }
        
        userRepository.save(user);
        
        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        } catch (Exception e) {
            System.err.println("Failed to send welcome email to " + user.getEmail() + ": " + e.getMessage());
        }

        response.put("message", "User registered successfully as " + user.getRole());

        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(
            @RequestParam String email,
            @RequestParam String password) {

        Map<String, Object> response = new HashMap<>();

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );
        } catch (Exception e) {
            response.put("error", "Invalid credentials");
            return response;
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        final String jwt = jwtUtils.generateToken(userDetails);
        
        User user = userRepository.findByEmail(email);

        response.put("token", jwt);
        response.put("role", user.getRole().name().toLowerCase());
        response.put("email", user.getEmail());
        response.put("name", user.getName());
        
        return response;
    }
}

