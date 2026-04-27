package org.example.product.Controller;

import org.example.product.*;
import org.example.product.repo.LigneCommandeRepository;
import org.example.product.repo.PanierRepository;
import org.example.product.repo.ProductRepository;
import org.example.product.repo.UserRepository;
import org.example.product.service.EmailService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/products")
@CrossOrigin("*")
public class ProductController {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final LigneCommandeRepository ligneCommandeRepository;
    private final PanierRepository panierRepository;
    private final EmailService emailService;

    public ProductController(ProductRepository productRepository,
                             UserRepository userRepository,
                             LigneCommandeRepository ligneCommandeRepository,
                             PanierRepository panierRepository,
                             EmailService emailService) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.ligneCommandeRepository = ligneCommandeRepository;
        this.panierRepository = panierRepository;
        this.emailService = emailService;
    }
    @GetMapping
    public List<Product> getAll(@RequestParam(required = false) String fournisseurEmail) {
        if (fournisseurEmail != null && !fournisseurEmail.trim().isEmpty()) {
            return productRepository.findByFournisseurEmail(fournisseurEmail);
        }
        return productRepository.findAll();
    }

    @PostMapping
    public Product add(
            @RequestParam String name,
            @RequestParam double price,
            @RequestParam Long categoryId,
            @RequestParam(required = false) String fournisseurEmail,
            @RequestParam MultipartFile image
    ) throws IOException {

        String uploadDir = "uploads/";
        String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();

        Path path = Paths.get(uploadDir + fileName);
        Files.createDirectories(path.getParent());
        Files.write(path, image.getBytes());

        Product product = new Product();
        product.setName(name);
        product.setPrice(price);
        product.setImageUrl("http://localhost:8080/uploads/" + fileName);

        // category
        Category category = new Category();
        category.setId(categoryId);
        product.setCategory(category);

        // 🔥 fournisseur dynamiquement attribué par email
        User fournisseur = null;
        if (fournisseurEmail != null && !fournisseurEmail.trim().isEmpty()) {
            fournisseur = userRepository.findByEmail(fournisseurEmail);
            if (fournisseur == null) {
                fournisseur = new User();
                fournisseur.setEmail(fournisseurEmail);
                fournisseur.setName(fournisseurEmail.split("@")[0]);
                fournisseur.setRole(UserRole.FOURNISSEUR);
                fournisseur = userRepository.save(fournisseur);
            }
        }
        product.setFournisseur(fournisseur);

        return productRepository.save(product);
    }



    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            if (product.getLigneCommandes() != null) {
                for (LigneCommande lc : product.getLigneCommandes()) {
                    lc.setProduct(null);
                    ligneCommandeRepository.save(lc);
                }
            }
            productRepository.delete(product);
        }
    }
    // 🔹 LigneCommande
    @PostMapping("/ligneCommande")
    public LigneCommande addLigneCommande(@RequestParam Long productId,
                                          @RequestParam int quantity) {
        System.out.println("DEBUG: Creation LigneCommande pour ProductID=" + productId + ", Qte=" + quantity);
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Produit avec ID " + productId + " introuvable dans la base !"));
            
        LigneCommande ligneCommande = new LigneCommande(product, quantity);
        LigneCommande saved = ligneCommandeRepository.save(ligneCommande);
        System.out.println("DEBUG: LigneCommande sauvegardee avec ID=" + saved.getId());
        return saved;
    }

    // 🔹 Panier
    @PostMapping("/panier")
    public Panier addPanier(@RequestParam String user,
                            @RequestParam List<Long> ligneCommandeIds) {
        Panier panier = new Panier();
        
        User client = userRepository.findByEmail(user);
        if (client != null) {
            panier.setClient(client);
        }
        
        List<LigneCommande> lignes = ligneCommandeRepository.findAllById(ligneCommandeIds);
        panier.setLigneCommandes(lignes);
        Panier savedPanier = panierRepository.save(panier);
        
        try {
            emailService.sendOrderConfirmation(savedPanier);
        } catch (Exception e) {
            System.err.println("Erreur d'envoi de l'email de confirmation : " + e.getMessage());
        }
        
        return savedPanier;
    }

    @GetMapping("/panier")
    public List<Panier> getAllPaniers(@RequestParam(required = false) String email,
                                     @RequestParam(required = false) String fournisseurEmail) {
        if (email != null && !email.trim().isEmpty()) {
            return panierRepository.findByClientEmail(email);
        }
        if (fournisseurEmail != null && !fournisseurEmail.trim().isEmpty()) {
            return panierRepository.findByFournisseurEmail(fournisseurEmail);
        }
        return panierRepository.findAll();
    }

    @PutMapping("/panier/{id}/status")
    public Panier updatePanierStatus(@PathVariable Long id, @RequestParam String status) {
        Panier panier = panierRepository.findById(id).orElseThrow();
        panier.setStatus(status);
        return panierRepository.save(panier);
    }
}
