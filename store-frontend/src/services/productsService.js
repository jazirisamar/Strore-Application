import api from "./api";

const API_URL = "/products";

export const getProducts = (email = null) => {
  const params = email ? { fournisseurEmail: email } : {};
  return api.get(API_URL, { params });
};

export const addProduct = (formData) => {
  return api.post(API_URL, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const deleteProduct = (id) => {
  return api.delete(`${API_URL}/${id}`);
};

export const addLigneCommande = (productId, quantity) => {
  return api.post(`${API_URL}/ligneCommande`, null, {
    params: { productId, quantity }
  });
};

export const addPanier = (user, ligneCommandeIds) => {
  const params = new URLSearchParams();
  params.append("user", user);
  ligneCommandeIds.forEach(id => params.append("ligneCommandeIds", id));
  
  return api.post(`${API_URL}/panier`, null, { params });
};

export const getOrders = (email, isFournisseur = false) => {
  const params = isFournisseur ? { fournisseurEmail: email } : { email };
  return api.get(`${API_URL}/panier`, { params });
};

export const updateOrderStatus = (id, status) => {
  return api.put(`${API_URL}/panier/${id}/status`, null, {
    params: { status }
  });
};