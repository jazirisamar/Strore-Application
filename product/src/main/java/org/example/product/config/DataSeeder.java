package org.example.product.config;

import org.example.product.*;
import org.example.product.repo.CategoryRepository;
import org.example.product.repo.ProductRepository;
import org.example.product.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(ProductRepository productRepository, 
                      CategoryRepository categoryRepository, 
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        
        // 1. Création des utilisateurs (si inexistant ou mot de passe non haché)
        seedUser("admin@antigravity.com", "admin123", "Admin Antigravity", UserRole.ADMIN);
        seedUser("fournisseur@test.com", "password123", "Fournisseur Officiel", UserRole.FOURNISSEUR);
        seedUser("client@test.com", "client123", "Client Test", UserRole.CLIENT);

        // 2. Création de données (seulement si vide)
        if (productRepository.count() == 0) {
            
            // Création de catégories
            Category electronique = categoryRepository.save(new Category(null, "Électronique"));
            Category vetements = categoryRepository.save(new Category(null, "Vêtements"));
            Category maison = categoryRepository.save(new Category(null, "Maison & Déco"));

            User fournisseur = userRepository.findByEmail("fournisseur@test.com");

            // Création des produits
            Product p1 = new Product();
            p1.setName("Casque Audio Bluetooth");
            p1.setPrice(150.0);
            p1.setImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400");
            p1.setCategory(electronique);
            p1.setFournisseur(fournisseur);

            Product p2 = new Product();
            p2.setName("Smartwatch Pro");
            p2.setPrice(299.99);
            p2.setImageUrl("https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&q=80&w=400");
            p2.setCategory(electronique);
            p2.setFournisseur(fournisseur);

            Product p3 = new Product();
            p3.setName("T-shirt en Coton Minimaliste");
            p3.setPrice(25.0);
            p3.setImageUrl("https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=400");
            p3.setCategory(vetements);
            p3.setFournisseur(fournisseur);

            Product p4 = new Product();
            p4.setName("Lampe de Bureau LED");
            p4.setPrice(45.50);
            p4.setImageUrl("https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400");
            p4.setCategory(maison);
            p4.setFournisseur(fournisseur);

            Product p5 = new Product();
            p5.setName("Enceinte Intelligente");
            p5.setPrice(120.0);
            p5.setImageUrl("https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=400");
            p5.setCategory(electronique);
            p5.setFournisseur(fournisseur);

            productRepository.saveAll(List.of(p1, p2, p3, p4, p5));
            
            System.out.println("=============================================");
            System.out.println("✅ Données de démonstration ajoutées avec succès !");
            System.out.println("=============================================");
        }
    }

    private void seedUser(String email, String password, String name, UserRole role) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setRole(role);
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
            System.out.println("✅ Utilisateur créé : " + email);
        } else if (!user.getPassword().startsWith("$2a$")) {
            // Si le mot de passe n'est pas haché (ne commence pas par le préfixe BCrypt)
            user.setPassword(passwordEncoder.encode(password));
            userRepository.save(user);
        }
    }
}

