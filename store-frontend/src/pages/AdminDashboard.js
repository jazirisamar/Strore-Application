import React, { useEffect, useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { logoutUser, getCurrentUser } from "../services/authService";
import { Users, UserCheck, ShieldCheck, Trash2, CheckCircle, XCircle, LogOut } from "lucide-react";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalClients: 0, totalFournisseurs: 0 });
  const navigate = useNavigate();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchUsers();
    fetchStats();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/stats");
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role?role=${newRole}`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      alert("Erreur lors de la mise à jour du rôle");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Supprimer cet utilisateur ?")) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
        fetchStats();
      } catch (err) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const handleValidateSupplier = async (userId, approve) => {
    try {
      await api.post(`/admin/users/${userId}/validate-supplier?approve=${approve}`);
      fetchUsers();
      fetchStats();
    } catch (err) {
      alert("Erreur lors de la validation");
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const pendingRequests = users.filter(u => u.supplierRequestPending);

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">Marklio <span style={{ color: "var(--primary)" }}>OS</span></div>
        <div className="sidebar-nav">
          <button className="sidebar-link active">
            <ShieldCheck size={20} />
            <span>Console Admin</span>
          </button>
          <button className="sidebar-link">
            <Users size={20} />
            <span>Utilisateurs</span>
          </button>
        </div>
        <button className="sidebar-link" onClick={handleLogout} style={{ marginTop: 'auto', color: 'var(--accent)' }}>
          <LogOut size={20} />
          <span>Déconnexion</span>
        </button>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Supervision Système</h1>
            <p className="dashboard-subtitle">Gérez les accès et surveillez l'activité globale.</p>
          </div>
          <div className="user-profile">
            <span>{user?.email}</span>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--grad-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              A
            </div>
          </div>
        </header>

        <div className="stats-grid">
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Total Utilisateurs</span>
              <Users size={24} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Clients Actifs</span>
              <UserCheck size={24} style={{ color: 'var(--secondary)' }} />
            </div>
            <div className="stat-value">{stats.totalClients}</div>
          </div>
          <div className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Fournisseurs</span>
              <ShieldCheck size={24} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="stat-value">{stats.totalFournisseurs}</div>
          </div>
        </div>

        {pendingRequests.length > 0 && (
          <div className="card-modern" style={{ marginBottom: '40px', border: '1px solid var(--primary-glow)' }}>
            <h2 style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle size={24} style={{ color: 'var(--primary)' }} />
              Demandes Fournisseur en attente
            </h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRequests.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => handleValidateSupplier(u.id, true)} className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>
                          Approuver
                        </button>
                        <button onClick={() => handleValidateSupplier(u.id, false)} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '13px', color: 'var(--accent)' }}>
                          Refuser
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="card-modern">
          <h2 style={{ marginBottom: '24px' }}>Base Utilisateurs</h2>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Utilisateur</th>
                  <th>Rôle Actuel</th>
                  <th>Modifier Rôle</th>
                  <th>Management</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 600 }}>{u.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{u.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-info' : u.role === 'FOURNISSEUR' ? 'badge-success' : 'badge-warning'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <select 
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        value={u.role}
                        className="dashboard-select"
                        style={{ padding: '6px 12px', fontSize: '13px' }}
                      >
                        <option value="CLIENT">Client</option>
                        <option value="FOURNISSEUR">Fournisseur</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteUser(u.id)} style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <Trash2 size={16} /> Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
