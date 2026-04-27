import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Package, 
  ShieldCheck, 
  Zap, 
  Users, 
  ArrowRight, 
  Star,
  Layers,
  Sparkles,
  Search
} from "lucide-react";
import { getProducts } from "../services/productsService";
import "../css/HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Load some products for the preview section
    getProducts().then(res => {
      setFeaturedProducts(res.data.slice(0, 4));
    }).catch(err => console.log(err));
  }, []);

  const stats = [
    { label: "Utilisateurs", value: "2.5k+", icon: <Users size={20} /> },
    { label: "Produits", value: "10k+", icon: <Package size={20} /> },
    { label: "Transactions", value: "50k+", icon: <ShoppingCart size={20} /> },
    { label: "Sécurité", value: "100%", icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div className="home-root">
      {/* Animated Background Elements */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>
      <div className="bg-glow bg-glow-3"></div>

      {/* NAVBAR */}
      <nav className="home-nav glass">
        <div className="logo-container" onClick={() => navigate("/")}>
          <div className="logo-icon"><Zap size={24} fill="white" /></div>
          <span className="logo-text">Mark<span>lio</span></span>
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={() => navigate("/shop")}>Boutique</button>
          <button className="nav-btn" onClick={() => navigate("/contact")}>Contact</button>
          <button className="btn-primary" onClick={() => navigate("/login")}>Commençer</button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="home-hero">
        <motion.div 
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Sparkles size={14} /> <span>La Marketplace B2B/B2C Intelligent</span>
        </motion.div>

        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Réinventez votre <br /> 
          <span className="gradient-text">Expérience de Vente</span>
        </motion.h1>

        <motion.p 
          className="hero-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Marklio connecte les fournisseurs et les clients sur une plateforme unique, 
          moderne et sécurisée. Gérez vos stocks ou achetez en toute simplicité.
        </motion.p>

        <motion.div 
          className="hero-btns"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <button className="btn-primary hero-btn-lg" onClick={() => navigate("/shop")}>
            Explorer la Boutique <ArrowRight size={18} />
          </button>
          <button className="btn-secondary hero-btn-lg" onClick={() => navigate("/register")}>
            Devenir Fournisseur
          </button>
        </motion.div>

        {/* Stats Row */}
        <motion.div 
          className="hero-stats"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {stats.map((s, i) => (
            <div key={i} className="stat-item">
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-content">
                <span className="stat-val">{s.value}</span>
                <span className="stat-lab">{s.label}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ROLES SECTION */}
      <section className="home-roles">
        <div className="section-header">
          <h2 className="section-title">Une solution, <span className="gradient-text">Deux facettes</span></h2>
          <p className="section-subtitle">Choisissez l'expérience qui correspond à vos besoins.</p>
        </div>

        <div className="roles-grid">
          <motion.div 
            className="role-card glass"
            whileHover={{ y: -10 }}
            onClick={() => navigate("/shop")}
          >
            <div className="role-icon-box box-blue">
               <ShoppingCart size={32} />
            </div>
            <h3>Je suis Acheteur</h3>
            <p>Accédez à des milliers de produits, suivez vos commandes en temps réel et profitez d'un paiement sécurisé.</p>
            <ul className="role-features">
              <li><Star size={14} /> Suivi de commande live</li>
              <li><Star size={14} /> Catalogue multi-fournisseurs</li>
              <li><Star size={14} /> Support client dédié</li>
            </ul>
            <div className="role-action">Commencer mes achats <ArrowRight size={16} /></div>
          </motion.div>

          <motion.div 
            className="role-card glass"
            whileHover={{ y: -10 }}
            onClick={() => navigate("/register")}
          >
            <div className="role-icon-box box-green">
               <Layers size={32} />
            </div>
            <h3>Je suis Vendeur</h3>
            <p>Propulsez votre business avec nos outils de gestion de stock, d'analyse de vente et de logistique intégrée.</p>
            <ul className="role-features">
              <li><Star size={14} /> Dashboard d'analyse</li>
              <li><Star size={14} /> Gestion d'inventaire agile</li>
              <li><Star size={14} /> Paiements automatisés</li>
            </ul>
            <div className="role-action action-green">Ouvrir ma boutique <ArrowRight size={16} /></div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED PREVIEW */}
      <section className="home-preview">
         <div className="preview-content">
            <h2 className="section-title">Aperçu du <span className="gradient-text">Catalogue</span></h2>
            <p className="section-subtitle">Découvrez les tendances actuelles sélectionnées pour vous.</p>
            
            <div className="preview-grid">
               {featuredProducts.length > 0 ? featuredProducts.map(p => (
                 <div key={p.id} className="preview-card glass">
                    <img src={p.imageUrl} alt={p.name} />
                    <div className="preview-info">
                       <h4>{p.name}</h4>
                       <span>{p.price} DT</span>
                    </div>
                 </div>
               )) : (
                 [1, 2, 3, 4].map(i => (
                   <div key={i} className="preview-card glass skeleton">
                      <div className="skeleton-img"></div>
                      <div className="preview-info">
                         <div className="skeleton-line"></div>
                         <div className="skeleton-line short"></div>
                      </div>
                   </div>
                 ))
               )}
            </div>
            <button className="btn-secondary" onClick={() => navigate("/shop")} style={{ marginTop: '40px' }}>
              Voir tout le catalogue
            </button>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
             <div className="logo-container">
                <div className="logo-icon"><Zap size={20} fill="white" /></div>
                <span className="logo-text">Mark<span>lio</span></span>
             </div>
             <p>L'excellence e-commerce à portée de main.</p>
          </div>
          <div className="footer-links">
             <div className="link-group">
                <h5>Plateforme</h5>
                <span>Boutique</span>
                <span>Fournisseurs</span>
                <span>Tarifs</span>
             </div>
             <div className="link-group">
                <h5>Légal</h5>
                <span>Confidentialité</span>
                <span>Conditions</span>
                <span>Mentions</span>
             </div>
          </div>
        </div>
        <div className="footer-bottom">
           © {new Date().getFullYear()} Marklio Global. Designed for performance.
        </div>
      </footer>
    </div>
  );
}
