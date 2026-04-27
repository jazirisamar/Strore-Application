package org.example.product;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(unique = true)
    private String email;
    
    private String password;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    private boolean supplierRequestPending = false;

    @OneToMany(mappedBy = "fournisseur")
    @JsonIgnore
    private List<Product> products;

    @OneToMany(mappedBy = "client")
    @JsonIgnore
    private List<Panier> paniers;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public boolean isSupplierRequestPending() {
        return supplierRequestPending;
    }

    public void setSupplierRequestPending(boolean supplierRequestPending) {
        this.supplierRequestPending = supplierRequestPending;
    }

    // Helper methods for role checks
    public boolean isAdmin() {
        return UserRole.ADMIN.equals(this.role);
    }

    public boolean isFournisseur() {
        return UserRole.FOURNISSEUR.equals(this.role);
    }

    public boolean isClient() {
        return UserRole.CLIENT.equals(this.role);
    }
}
