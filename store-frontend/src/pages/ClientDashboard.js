import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Heart, LogOut, ShoppingCart, Package, Calendar, User, Filter } from "lucide-react";
import { getProducts, addLigneCommande, addPanier, getOrders } from "../services/productsService";
import { getCategories } from "../services/categoryService";
import { motion } from "framer-motion";
import "../css/Dashboard.css";
import { logoutUser, getCurrentUser } from "../services/authService";

export default function ClientDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [view, setView] = useState("shop"); // 'shop', 'orders', 'profile'
  const [orders, setOrders] = useState([]);
  const [requestLoading, setRequestLoading] = useState(false);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "client") {
      navigate("/login");
    } else {
      setCurrentUser(user);
      loadProducts();
      loadCategories();
      loadOrders(user.email);
    }
  }, [navigate]);

  const loadOrders = (email) => {
    getOrders(email).then(res => setOrders(res.data)).catch(err => console.log(err));
  };

  const handleRequestSupplier = async () => {
    if (!currentUser || !currentUser.id) {
       // getCurrentUser might not have ID if not returned from backend login
       // Let's assume email is enough to find/request or use a separate fetch if needed
       alert("Erreur: ID utilisateur manquant");
       return;
    }
    setRequestLoading(true);
    try {
      await api.post(`/admin/users/${currentUser.id}/request-supplier`);
      alert("Demande envoyée à l'administrateur !");
      // Update local state if needed
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la demande");
    } finally {
      setRequestLoading(false);
    }
  };

  const loadProducts = () => {
    getProducts().then((res) => setProducts(res.data)).catch(err => console.log(err));
  };

  const loadCategories = () => {
    getCategories().then((res) => setCategories(res.data)).catch(err => console.log(err));
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
  };

  const handleCheckout = async () => {
    if (cart.length > 0) {
      try {
        const quantities = {};
        cart.forEach(p => {
          quantities[p.id] = (quantities[p.id] || 0) + 1;
        });

        const ligneIds = [];
        for (const [productId, quantity] of Object.entries(quantities)) {
          console.log(`Création ligne pour produit ${productId}, qté: ${quantity}`);
          const res = await addLigneCommande(productId, quantity);
          console.log("Détail réponse ligneCommande:", res.data);
          console.log("Clés reçues:", Object.keys(res.data));
          
          if (res.data && (res.data.id || res.data.id === 0)) {
            ligneIds.push(res.data.id);
          } else {
            console.error("ID absent. Objet reçu:", res.data);
            throw new Error(`ID manquant. Clés dispo: ${Object.keys(res.data).join(', ')}`);
          }
        }
        
        await addPanier(currentUser.email, ligneIds);
        
        alert("Commande passée avec succès !");
        setCart([]);
        setShowCartModal(false);
        if (currentUser?.email) loadOrders(currentUser.email);
      } catch (err) {
        console.error("Erreur lors de la commande:", err);
        alert("Erreur serveur lors de la commande. Vérifiez si tous les produits sont encore disponibles.");
      }
    }
  };

  const filteredProducts = filterCategory
    ? products.filter((p) => p.category && p.category.id === Number(filterCategory))
    : products;

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Mark<span style={{ color: "var(--primary)" }}>lio</span></div>
        <div className="sidebar-nav">
          <button 
            className={`sidebar-link ${view === "shop" ? "active" : ""}`} 
            onClick={() => setView("shop")}
          >
            <ShoppingBag size={20} />
            <span>Boutique</span>
          </button>
          <button 
            className={`sidebar-link ${view === "orders" ? "active" : ""}`} 
            onClick={() => setView("orders")}
          >
            <Package size={20} />
            <span>Mes Commandes</span>
          </button>
          <button 
            className={`sidebar-link ${view === "profile" ? "active" : ""}`} 
            onClick={() => setView("profile")}
          >
            <User size={20} />
            <span>Mon Profil</span>
          </button>
        </div>
        <button className="sidebar-link" onClick={handleLogout} style={{ marginTop: 'auto', color: 'var(--accent)' }}>
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </aside>

      {/* CONTENT */}
      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Bonjour, {currentUser?.name || "Client"}</h1>
            <p className="dashboard-subtitle">Explorez les meilleurs produits de nos fournisseurs.</p>
          </div>
          <div className="user-profile">
            <button className="cart-btn" onClick={() => setShowCartModal(true)}>
              <ShoppingCart size={22} />
              {cart.length > 0 && (
                <span className="cart-badge">{cart.length}</span>
              )}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginLeft: '10px' }}>
               <span style={{ fontWeight: 600, fontSize: '14px' }}>{currentUser?.email}</span>
               <span className="badge badge-info" style={{ fontSize: '10px', padding: '2px 8px' }}>CLIENT</span>
            </div>
          </div>
        </header>

        {showCartModal && (
          <div className="modal-overlay">
            <div className="modal-content card-modern" style={{ background: 'var(--bg-surface)' }}>
              <h2 style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: '15px' }}>Votre Panier</h2>
              {cart.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Le panier est vide.</p>
              ) : (
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {cart.map((item, idx) => (
                    <div key={idx} className="cart-item" style={{ borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                      <span style={{ fontWeight: 500 }}>{item.name}</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{item.price} DT</span>
                    </div>
                  ))}
                  <div className="cart-total" style={{ marginTop: '20px', fontSize: '20px', borderTop: '2px solid var(--primary)' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--primary)' }}>{cart.reduce((sum, item) => sum + Number(item.price), 0).toFixed(2)} DT</span>
                  </div>
                </div>
              )}
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setShowCartModal(false)}>Fermer</button>
                <button className="btn-primary" onClick={handleCheckout} disabled={cart.length === 0}>Passer la commande</button>
              </div>
            </div>
          </div>
        )}

        {view === "shop" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="dashboard-filter glass-panel" style={{ padding: '12px 24px', borderRadius: '15px' }}>
              <Filter size={18} style={{ color: 'var(--text-muted)' }} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="dashboard-select"
                style={{ border: 'none', background: 'transparent' }}
              >
                <option value="">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {filterCategory && (
                <button 
                  onClick={() => setFilterCategory("")}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                >
                  Réinitialiser
                </button>
              )}
            </div>

            <div className="store-grid">
              {filteredProducts.length === 0 && (
                <p className="empty" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '100px', color: 'var(--text-muted)' }}>Aucun produit disponible pour le moment.</p>
              )}

              {filteredProducts.map((p) => (
                <motion.div 
                  className="store-card" 
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                >
                  <div style={{ position: 'relative' }}>
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="store-card-img" />
                    ) : (
                      <div className="store-card-img" style={{ background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Image non disponible</div>
                    )}
                    {p.category && (
                      <div className="store-card-category" style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)' }}>
                        {p.category.name}
                      </div>
                    )}
                  </div>
                  <div className="store-card-body">
                    <h3 className="store-card-title">{p.name}</h3>
                    <div className="store-card-footer">
                      <span className="store-card-price">{p.price} DT</span>
                      <button className="buy-btn" onClick={() => handleAddToCart(p)}>
                        Ajouter
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {view === "orders" && (
          <div className="orders-section">
            <h2 className="section-title">Historique des Commandes</h2>
            {orders.length === 0 ? (
              <p className="empty">Vous n'avez pas encore passé de commande.</p>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <motion.div 
                    key={order.id} 
                    className="order-card"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="order-header">
                      <div className="order-id-group">
                        <span className="order-id">Commande #{order.id}</span>
                        <span className="order-date">
                          <Calendar size={14} /> 
                          {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'Récent'}
                        </span>
                      </div>
                      <span className={`badge ${order.status === 'Livré' ? 'badge-success' : 'badge-warning'}`}>
                        {order.status || 'En attente'}
                      </span>
                    </div>

                    <div className="order-body">
                      {order.ligneCommandes?.map((item) => (
                        <div key={item.id} className="order-item-row" style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>{item.product?.name}</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qté: {item.quantity}</div>
                          </div>
                          <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{(item.product?.price * item.quantity).toFixed(2)} DT</div>
                        </div>
                      ))}
                      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Montant total</span>
                         <span style={{ fontSize: '20px', fontWeight: 800 }}>
                            {order.ligneCommandes?.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0).toFixed(2)} DT
                         </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {view === "profile" && (
          <div className="profile-section" style={{ maxWidth: '800px' }}>
            <h2 className="section-title">Paramètres du Profil</h2>
            <div className="card-modern" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
              <div style={{ textAlign: 'center', padding: '20px', borderRight: '1px solid var(--border-light)' }}>
                <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--grad-primary)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', fontWeight: 'bold' }}>
                  {currentUser?.name?.[0] || 'U'}
                </div>
                <h3 style={{ marginBottom: '5px' }}>{currentUser?.name}</h3>
                <span className="badge badge-info">{currentUser?.role}</span>
              </div>
              <div>
                <div style={{ marginBottom: '30px' }}>
                  <label style={{ color: 'var(--text-muted)', fontSize: '13px', display: 'block', marginBottom: '8px' }}>Email</label>
                  <div className="glass-panel" style={{ padding: '12px 20px', fontWeight: 600 }}>{currentUser?.email}</div>
                </div>
                
                <div className="card-modern" style={{ background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>Devenir Fournisseur</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
                    Partagez vos créations avec la communauté Marklio et commencez à vendre vos produits dès aujourd'hui.
                  </p>
                  <button 
                    className="btn-primary" 
                    onClick={handleRequestSupplier}
                    disabled={requestLoading}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    {requestLoading ? "Demande en cours..." : "Soumettre ma candidature"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
