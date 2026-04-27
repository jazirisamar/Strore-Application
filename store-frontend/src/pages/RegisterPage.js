import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { registerUser } from "../services/authService";
import { Zap } from "lucide-react";
import "../css/Auth.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("client");

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    try {
      const res = await registerUser(email, password, role);
      if (res.data.error) {
        alert(res.data.error);
        return;
      }
      
      alert("Inscription réussie ! Veuillez vous connecter.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'inscription");
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card glass-panel"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="logo-container flex-center" style={{ marginBottom: '20px', cursor: 'pointer' }} onClick={() => navigate("/")}>
          <div className="logo-icon"><Zap size={20} fill="white" /></div>
          <span className="logo-text" style={{ fontSize: '20px' }}>Mark<span>lio</span></span>
        </div>
        <h2 className="auth-title">Créer un compte</h2>
        <p className="auth-subtitle">Rejoignez Marklio pour propulser vos projets</p>

        <form className="auth-form" onSubmit={handleRegister}>
          <div className="input-group">
            <label>Adresse Email</label>
            <input 
              type="email" 
              placeholder="votre@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="auth-btn"
          >
            Créer mon compte
          </motion.button>
        </form>

        <p className="auth-link">
          Déjà un compte ? <span onClick={() => navigate("/login")}>Se connecter</span>
        </p>
      </motion.div>
    </div>
  );
}
