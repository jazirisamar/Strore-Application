package org.example.product;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Getter
@Setter
@ToString(exclude = "paniers")
@EqualsAndHashCode(of = "id")
@AllArgsConstructor
@NoArgsConstructor
public class LigneCommande {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("id")
    private Long id;

    private int quantity;

    // 🔹 Relation vers Product
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    // 🔹 Relation vers Panier
    @JsonIgnore
    @ManyToMany(mappedBy = "ligneCommandes")
    private List<Panier> paniers;
    // Constructeur sans argument requis par JPA
    public LigneCommande() {
    }

    // 🔹 Nouveau constructeur pratique
    public LigneCommande(Product product, int quantity) {
        this.product = product;
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public List<Panier> getPaniers() {
        return paniers;
    }

    public void setPaniers(List<Panier> paniers) {
        this.paniers = paniers;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}