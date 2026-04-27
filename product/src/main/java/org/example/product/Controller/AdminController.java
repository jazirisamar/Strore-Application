package org.example.product.Controller;

import org.example.product.User;
import org.example.product.UserRole;
import org.example.product.repo.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {

    private final UserRepository userRepository;

    public AdminController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/users/{id}/role")
    public User updateRole(@PathVariable Long id, @RequestParam String role) {
        User user = userRepository.findById(id).orElseThrow();
        user.setRole(UserRole.valueOf(role.toUpperCase()));
        return userRepository.save(user);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
    }

    @GetMapping("/stats")
    public Map<String, Long> getStats() {
        return Map.of(
            "totalUsers", userRepository.count(),
            "totalClients", (long) userRepository.findByRole(UserRole.CLIENT).size(),
            "totalFournisseurs", (long) userRepository.findByRole(UserRole.FOURNISSEUR).size()
        );
    }

    @PostMapping("/users/{id}/request-supplier")
    public User requestSupplier(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();
        user.setSupplierRequestPending(true);
        return userRepository.save(user);
    }

    @PostMapping("/users/{id}/validate-supplier")
    public User validateSupplier(@PathVariable Long id, @RequestParam boolean approve) {
        User user = userRepository.findById(id).orElseThrow();
        if (approve) {
            user.setRole(UserRole.FOURNISSEUR);
        }
        user.setSupplierRequestPending(false);
        return userRepository.save(user);
    }
}
