export const API_URL = 'http://localhost:3005';

export const ENDPOINTS = {
  auth: {
    login: `${API_URL}/api/auth/login`,
  },
  products: {
    list: `${API_URL}/api/producto`,
    create: `${API_URL}/api/producto`,
    update: (id: string) => `${API_URL}/api/producto/${id}`,
    delete: (id: string) => `${API_URL}/api/producto/${id}`,
  },
  materials: {
    list: `${API_URL}/api/material`,
    create: `${API_URL}/api/material`,
    update: (id: string) => `${API_URL}/api/material/${id}`,
    delete: (id: string) => `${API_URL}/api/material/${id}`,
  },
  inventory: {
    list: `${API_URL}/api/inventario`,
    create: `${API_URL}/api/inventario`,
    delete: (id: string) => `${API_URL}/api/inventario/${id}`,
  },
};