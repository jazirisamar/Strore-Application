import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import "../css/HomePage.css";

export default function ContactPage() {
  const navigate = useNavigate();

  return (
    <div className="home-root">
      {/* Animated Background Elements */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-3"></div>

      {/* NAVBAR */}
      <nav className="home-nav glass">
        <div className="logo-container" onClick={() => navigate("/")}>
          <div className="logo-icon"><Zap size={24} fill="white" /></div>
          <span className="logo-text">Mark<span>lio</span></span>
        </div>
        <div className="nav-actions">
          <button className="nav-btn" onClick={() => navigate("/")}>Accueil</button>
          <button className="nav-btn" onClick={() => navigate("/shop")}>Boutique</button>
          <button className="btn-primary" onClick={() => navigate("/login")}>Connexion</button>
        </div>
      </nav>

      {/* HERO / CONTACT SECTION */}
      <section className="home-hero" style={{ paddingBottom: '60px' }}>
        <motion.div 
          className="hero-badge"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <MessageSquare size={14} /> <span>Assistance 24/7 disponible</span>
        </motion.div>

        <motion.h1 
          className="hero-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Parlons de votre <br /> 
          <span className="gradient-text">Prochain Succès</span>
        </motion.h1>

        <motion.p 
          className="hero-desc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Une question ? Un besoin spécifique ? Notre équipe d'experts est à votre 
          disposition pour vous accompagner dans votre aventure Marklio.
        </motion.p>
      </section>

      <section className="home-roles" style={{ marginTop: '-40px' }}>
         <div className="contact-wrapper">
            <motion.div 
              className="contact-form glass"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              style={{ background: 'var(--bg-card)', padding: '40px', borderRadius: '30px' }}
            >
               <h3 style={{ marginBottom: '25px', fontSize: '24px' }}>Envoyez-nous un message</h3>
               <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={(e) => e.preventDefault()}>
                  <div className="input-field">
                     <input type="text" placeholder="Nom Complet" className="dashboard-input" style={{ width: '100%' }} />
                  </div>
                  <div className="input-field">
                     <input type="email" placeholder="Adresse Email" className="dashboard-input" style={{ width: '100%' }} />
                     </div>
                  <div className="input-field">
                     <textarea placeholder="Votre message..." className="dashboard-input" rows={5} style={{ width: '100%', resize: 'none' }}></textarea>
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                     Envoyer <Send size={18} />
                  </button>
               </form>
            </motion.div>

            <motion.div 
              className="contact-info-panel"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
               <div className="info-card glass" style={{ padding: '30px', borderRadius: '30px', marginBottom: '20px' }}>
                  <div className="stat-item" style={{ marginBottom: '25px' }}>
                     <div className="stat-icon"><MapPin size={20} /></div>
                     <div className="stat-content">
                        <span className="stat-val" style={{ fontSize: '18px' }}>Tunisie</span>
                        <span className="stat-lab">Marklio Hub, Tunis</span>
                     </div>
                  </div>
                  <div className="stat-item" style={{ marginBottom: '25px' }}>
                     <div className="stat-icon"><Mail size={20} /></div>
                     <div className="stat-content">
                        <span className="stat-val" style={{ fontSize: '18px' }}>support@marklio.com</span>
                        <span className="stat-lab">Réponse en moins de 2h</span>
                     </div>
                  </div>
                  <div className="stat-item">
                     <div className="stat-icon"><Phone size={20} /></div>
                     <div className="stat-content">
                        <span className="stat-val" style={{ fontSize: '18px' }}>+216 71 000 000</span>
                        <span className="stat-lab">Lun-Ven, 9h-18h</span>
                     </div>
                  </div>
               </div>

               <div className="social-badge glass" style={{ padding: '20px', borderRadius: '20px', textAlign: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Suivez-nous sur les réseaux sociaux</span>
               </div>
            </motion.div>
         </div>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <div className="footer-bottom">
           © {new Date().getFullYear()} Marklio Global. Designed for excellence.
        </div>
      </footer>
    </div>
  );
}