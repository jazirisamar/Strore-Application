import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, addProduct, deleteProduct, getOrders, updateOrderStatus } from "../services/productsService";
import { getCategories } from "../services/categoryService";
import { motion } from "framer-motion";
import { LayoutDashboard, Package, LogOut, ShoppingCart, CheckCircle, Clock, Truck, User } from "lucide-react";
import "../css/Dashboard.css";
import "../css/product.css";
import { logoutUser, getCurrentUser } from "../services/authService";

export default function ProviderDashboard() {
  const navigate = useNavigate();

  const [view, setView] = useState("products"); // 'products' or 'orders'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);

  const [filterCategory, setFilterCategory] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.role !== "fournisseur") {
      navigate("/login");
    } else {
      setCurrentUser(user);
      loadProducts(user.email);
      loadCategories();
      loadOrders(user.email);
    }
  }, [navigate]);

  const loadProducts = (email) => {
    getProducts(email).then((res) => setProducts(res.data)).catch(err => console.log(err));
  };

  const loadCategories = () => {
    getCategories().then((res) => setCategories(res.data)).catch(err => console.log(err));
  };

  const loadOrders = (email) => {
    getOrders(email, true).then(res => setOrders(res.data)).catch(err => console.log(err));
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus).then(() => {
      loadOrders(currentUser.email);
    }).catch(err => alert("Erreur lors de la mise à jour du statut"));
  };

  const handleAddProduct = () => {
    if (!name || !price || !categoryId || !image) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("categoryId", categoryId);
    formData.append("image", image);
    if (currentUser?.email) {
      formData.append("fournisseurEmail", currentUser.email);
    }

    addProduct(formData).then(() => {
      loadProducts(currentUser.email);
      setName("");
      setPrice("");
      setCategoryId("");
      setImage(null);
      setShowModal(false);
    });
  };

  const handleDelete = (id) => {
    deleteProduct(id).then(() => loadProducts(currentUser.email));
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const filteredProducts = filterCategory
    ? products.filter((p) => p.category && p.category.id === Number(filterCategory))
    : products;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Livré': return <span className="badge badge-success">Livré</span>;
      case 'Expédié': return <span className="badge badge-info">Expédié</span>;
      default: return <span className="badge badge-warning">En attente</span>;
    }
  };

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Mark<span style={{ color: "var(--primary)" }}>lio</span></div>
        <div className="sidebar-nav">
          <button className={`sidebar-link ${view === 'products' ? 'active' : ''}`} onClick={() => setView('products')}>
            <Package size={20} />
            <span>Mes Produits</span>
          </button>
          <button className={`sidebar-link ${view === 'orders' ? 'active' : ''}`} onClick={() => setView('orders')}>
            <ShoppingCart size={20} />
            <span>Commandes</span>
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
            <h1 className="dashboard-title">{view === 'products' ? 'Gestion Inventaire' : 'Suivi Commandes'}</h1>
            <p className="dashboard-subtitle">
              {view === 'products' 
                ? 'Gérez votre catalogue de produits et vos stocks.' 
                : 'Suivez les commandes de vos clients et mettez à jour leur statut.'}
            </p>
          </div>
          <div className="user-profile">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginRight: '10px' }}>
               <span style={{ fontWeight: 600, fontSize: '14px' }}>{currentUser?.email}</span>
               <span className="badge badge-success" style={{ fontSize: '10px', padding: '2px 8px' }}>FOURNISSEUR</span>
            </div>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {currentUser?.email?.[0].toUpperCase()}
            </div>
          </div>
        </header>

        {view === 'products' ? (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Produits Actifs</span>
                  <div className="stat-value">{products.length}</div>
              </div>
              <div className="stat-card">
                  <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Catégories Utilisées</span>
                  <div className="stat-value">{[...new Set(products.map(p => p.category?.id))].length}</div>
              </div>
              <div className="stat-card" style={{ cursor: 'pointer', border: '1px dashed var(--primary)' }} onClick={() => setShowModal(true)}>
                  <span style={{ color: 'var(--primary)', fontWeight: 700 }}>+ Ajouter un produit</span>
                  <div className="stat-value" style={{ fontSize: '20px', color: 'var(--text-muted)' }}>Nouveau</div>
              </div>
            </div>

            <div className="dashboard-filter glass-panel" style={{ padding: '16px 24px', marginBottom: '30px' }}>
              <select
                className="dashboard-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
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
                <button style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontWeight: 600 }} onClick={() => setFilterCategory("")}>
                  Réinitialiser
                </button>
              )}
            </div>

            {showModal && (
              <div className="modal-overlay">
                <div className="modal-content card-modern" style={{ background: 'var(--bg-surface)' }}>
                  <h2 style={{ marginBottom: '20px' }}>Nouveau Produit</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                      className="dashboard-input"
                      placeholder="Nom du produit"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      className="dashboard-input"
                      placeholder="Prix (DT)"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                    <select
                      className="dashboard-select"
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                    >
                      <option value="">Sélectionner une catégorie</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div style={{ border: '1px dashed var(--border-light)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
                      <input
                        type="file"
                        accept="image/*"
                        id="file-upload"
                        hidden
                        onChange={(e) => setImage(e.target.files[0])}
                      />
                      <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <Package size={32} style={{ color: 'var(--text-muted)' }} />
                        <span style={{ fontSize: '14px' }}>{image ? image.name : "Cliquez pour uploader une image"}</span>
                      </label>
                    </div>
                  </div>
                  <div className="modal-actions" style={{ marginTop: '20px' }}>
                    <button className="btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                    <button className="btn-primary" onClick={handleAddProduct}>Enregistrer</button>
                  </div>
                </div>
              </div>
            )}

            <div className="store-grid">
              {filteredProducts.length === 0 && (
                <p className="empty" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>Votre inventaire est vide.</p>
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
                      <div className="store-card-img" style={{ background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Sans image</div>
                    )}
                    <div className="store-card-category" style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(4px)' }}>{p.category?.name}</div>
                  </div>
                  <div className="store-card-body">
                    <h3 className="store-card-title">{p.name}</h3>
                    <div className="store-card-footer">
                      <span className="store-card-price">{p.price} DT</span>
                      <button className="btn-secondary" onClick={() => handleDelete(p.id)} style={{ padding: '8px', color: 'var(--accent)', borderColor: 'rgba(244, 63, 94, 0.2)' }}>
                        Supprimer
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <div className="dashboard-orders">
             <div className="stats-grid">
                <div className="stat-card">
                    <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Commandes Reçues</span>
                    <div className="stat-value">{orders.length}</div>
                </div>
                <div className="stat-card">
                    <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Chiffre d'Affaire</span>
                    <div className="stat-value" style={{ color: 'var(--secondary)' }}>
                       {orders.reduce((acc, order) => {
                          const providerTotal = order.ligneCommandes
                            .filter(lc => lc.product?.fournisseur?.email === currentUser?.email)
                            .reduce((sum, lc) => sum + (lc.product?.price * lc.quantity), 0);
                          return acc + providerTotal;
                       }, 0).toFixed(2)} DT
                    </div>
                </div>
             </div>

             <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
               <table className="dashboard-table">
                 <thead>
                   <tr>
                     <th>Commande ID</th>
                     <th>Client</th>
                     <th>Date</th>
                     <th>Produits</th>
                     <th>Total (Vos produits)</th>
                     <th>Statut Actuel</th>
                     <th>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {orders.length === 0 && (
                     <tr>
                       <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Aucune commande reçue pour le moment.</td>
                     </tr>
                   )}
                   {orders.map(order => {
                      const myProducts = order.ligneCommandes.filter(lc => lc.product?.fournisseur?.email === currentUser?.email);
                      const myTotal = myProducts.reduce((sum, lc) => sum + (lc.product?.price * lc.quantity), 0);

                      return (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                               <User size={14} style={{ color: 'var(--primary)' }} />
                               {order.client?.email}
                            </div>
                          </td>
                          <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                          <td>
                             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                               {myProducts.map(lc => (
                                 <span key={lc.id} style={{ fontSize: '12px' }}>
                                   {lc.product?.name} <span style={{ color: 'var(--text-muted)' }}>x{lc.quantity}</span>
                                 </span>
                               ))}
                             </div>
                          </td>
                          <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{myTotal.toFixed(2)} DT</td>
                          <td>{getStatusBadge(order.status)}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                               <button 
                                 className="btn-secondary" 
                                 title="Expédier"
                                 onClick={() => handleUpdateStatus(order.id, 'Expédié')}
                                 style={{ padding: '6px', borderRadius: '8px', opacity: order.status === 'Expédié' ? 0.5 : 1 }}
                                 disabled={order.status === 'Expédié' || order.status === 'Livré'}
                               >
                                 <Truck size={16} />
                               </button>
                               <button 
                                 className="btn-primary" 
                                 title="Confirmer Livraison"
                                 onClick={() => handleUpdateStatus(order.id, 'Livré')}
                                 style={{ padding: '6px', borderRadius: '8px', opacity: order.status === 'Livré' ? 0.5 : 1 }}
                                 disabled={order.status === 'Livré'}
                               >
                                 <CheckCircle size={16} />
                               </button>
                            </div>
                          </td>
                        </tr>
                      );
                   })}
                 </tbody>
               </table>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
