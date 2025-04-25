const API_URL = 'http://localhost:3005/api';

export interface Producto {
  id?: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  description: string;
  color: string;
  dimensions: {
    height: string;
    width: string;
    depth: string;
  };
  imageUrl: string;
  tipo_producto_id: string;
}

export const productoAPI = {
  getAll: async (): Promise<Producto[]> => {
    const response = await fetch(`${API_URL}/producto`);
    if (!response.ok) throw new Error('Error al obtener productos');
    return response.json();
  },

  getById: async (id: string): Promise<Producto> => {
    const response = await fetch(`${API_URL}/producto/${id}`);
    if (!response.ok) throw new Error('Error al obtener el producto');
    return response.json();
  },

  create: async (producto: Producto): Promise<Producto> => {
    const response = await fetch(`${API_URL}/producto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    });
    if (!response.ok) throw new Error('Error al crear el producto');
    return response.json();
  },

  update: async (id: string, producto: Producto): Promise<Producto> => {
    const response = await fetch(`${API_URL}/producto/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(producto),
    });
    if (!response.ok) throw new Error('Error al actualizar el producto');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/producto/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar el producto');
  },
};