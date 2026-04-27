import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { loginUser } from "../services/authService";
import { Zap } from "lucide-react";
import "../css/Auth.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Veuillez entrer un email et un mot de passe");
      return;
    }

    try {
      const res = await loginUser(email, password);
      if (res.data.error) {
        alert(res.data.error);
        return;
      }
      
      const { role } = res.data;
      
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "fournisseur") {
        navigate("/provider-dashboard");
      } else {
        navigate("/client-dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la connexion");
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="auth-card glass-panel"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="logo-container flex-center" style={{ marginBottom: '20px', cursor: 'pointer' }} onClick={() => navigate("/")}>
          <div className="logo-icon"><Zap size={20} fill="white" /></div>
          <span className="logo-text" style={{ fontSize: '20px' }}>Mark<span>lio</span></span>
        </div>
        <h2 className="auth-title">Connexion</h2>
        <p className="auth-subtitle">Accédez à votre espace Marklio</p>

        <form className="auth-form" onSubmit={handleLogin}>
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
            Se connecter
          </motion.button>
        </form>

        <p className="auth-link">
          Pas encore de compte ? <span onClick={() => navigate("/register")}>S'inscrire ici</span>
        </p>
      </motion.div>
    </div>
  );
}
