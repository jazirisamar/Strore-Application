import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, ShoppingCart, Search, Filter, LogIn, User } from "lucide-react";
import { getProducts } from "../services/productsService";
import { getCategories } from "../services/categoryService";
import { motion } from "framer-motion";
import { getCurrentUser, isAuthenticated } from "../services/authService";
import "../css/Dashboard.css";

export default function ShopPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const loggedIn = isAuthenticated();
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadProducts();
    loadCategories();
    const savedCart = JSON.parse(localStorage.getItem("tempCart") || "[]");
    setCart(savedCart);
  }, []);

  const loadProducts = () => {
    getProducts().then((res) => setProducts(res.data)).catch(err => console.log(err));
  };

  const loadCategories = () => {
    getCategories().then((res) => setCategories(res.data)).catch(err => console.log(err));
  };

  const handleAddToCart = (product) => {
    const newCart = [...cart, product];
    setCart(newCart);
    localStorage.setItem("tempCart", JSON.stringify(newCart));
  };

  const handleCheckout = () => {
    if (!loggedIn) {
      alert("Créez un compte pour finaliser votre commande");
      navigate("/login");
    } else {
      navigate("/client-dashboard");
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory = filterCategory ? p.category?.id === Number(filterCategory) : true;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR for Shop */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Mark<span style={{ color: "var(--primary)" }}>lio</span></div>
        <div className="sidebar-nav">
          <button className="sidebar-link active">
            <ShoppingBag size={20} />
            <span>Catalogue</span>
          </button>
          {!loggedIn ? (
            <button className="sidebar-link" onClick={() => navigate("/login")}>
              <LogIn size={20} />
              <span>Connexion</span>
            </button>
          ) : (
            <button className="sidebar-link" onClick={() => navigate("/client-dashboard")}>
              <User size={20} />
              <span>Mon Espace</span>
            </button>
          )}
        </div>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Catalogue Marklio</h1>
            <p className="dashboard-subtitle">Explorez les innovations de nos fournisseurs partenaires.</p>
          </div>
          <div className="user-profile">
            <button className="cart-btn" onClick={handleCheckout} style={{ marginRight: loggedIn ? '10px' : '0' }}>
              <ShoppingCart size={22} />
              {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
            </button>
            {loggedIn && (
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{currentUser?.email}</span>
                  <span className="badge badge-info" style={{ fontSize: '10px', padding: '2px 8px' }}>CLIENT</span>
               </div>
            )}
            {!loggedIn && <button className="btn-primary" onClick={() => navigate("/login")}>Se connecter</button>}
          </div>
        </header>

        <div className="dashboard-filter" style={{ gap: '24px' }}>
          <div className="glass-panel" style={{ flex: 1, display: 'flex', alignItems: 'center', padding: '12px 20px', borderRadius: '15px' }}>
            <Search size={18} style={{ color: 'var(--text-muted)', marginRight: '12px' }} />
            <input 
              type="text" 
              placeholder="Rechercher un produit d'exception..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none', fontSize: '16px' }}
            />
          </div>
          <div className="glass-panel" style={{ padding: '4px 20px', borderRadius: '15px', display: 'flex', alignItems: 'center' }}>
            <Filter size={18} style={{ color: 'var(--text-muted)', marginRight: '10px' }} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="dashboard-select"
              style={{ border: 'none', background: 'transparent', paddingLeft: 0 }}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="store-grid">
          {filteredProducts.length === 0 && (
            <p className="empty" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: 'var(--text-muted)', fontSize: '18px' }}>
              Aucun produit ne correspond à votre recherche stellaire.
            </p>
          )}
          {filteredProducts.map((p) => (
            <motion.div 
              className="store-card" 
              key={p.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -8 }}
            >
              <div style={{ position: 'relative' }}>
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.name} className="store-card-img" />
                ) : (
                  <div className="store-card-img" style={{ background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Image non disponible</div>
                )}
                <div className="store-card-category" style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)' }}>
                   {p.category?.name || "Général"}
                </div>
              </div>
              <div className="store-card-body">
                <h3 className="store-card-title">{p.name}</h3>
                <div className="store-card-footer">
                  <span className="store-card-price">{p.price} DT</span>
                  <button className="btn-primary" onClick={() => handleAddToCart(p)} style={{ padding: '8px 16px' }}>
                    Acheter
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
