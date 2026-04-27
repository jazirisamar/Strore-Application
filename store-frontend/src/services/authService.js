import api from "./api";

export const registerUser = async (email, password, role) => {
  const params = new URLSearchParams();
  params.append("email", email);
  params.append("password", password);
  params.append("role", role);
  return api.post(`/auth/register`, null, { params });
};

export const loginUser = async (email, password) => {
  const params = new URLSearchParams();
  params.append("email", email);
  params.append("password", password);
  const response = await api.post(`/auth/login`, null, { params });
  if (response.data && !response.data.error) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response;
};

export const logoutUser = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("user");
};

export const getRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};
