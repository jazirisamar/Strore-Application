package org.example.product.repo;

import org.example.product.Panier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface PanierRepository extends JpaRepository<Panier, Long> {
    List<Panier> findByClientEmail(String email);

    @Query("SELECT DISTINCT p FROM Panier p JOIN p.ligneCommandes lc JOIN lc.product pr WHERE pr.fournisseur.email = :email")
    List<Panier> findByFournisseurEmail(@Param("email") String email);
}