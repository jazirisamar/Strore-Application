import api from "./api";

const API_URL = "/categories";

export const getCategories = () => api.get(API_URL);