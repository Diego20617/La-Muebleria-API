export type Producto = {
  id: number
  nombre: string
  descripcion: string
  precio: number
  precio_anterior?: number
  descuento?: number
  stock: number
  categoria_id: number
  imagen_url: string
  imagenes_adicionales?: string[]
  destacado: boolean
  nuevo: boolean
  rating?: number
  created_at: string
  updated_at: string
}

export type Categoria = {
  id: number
  nombre: string
  slug: string
  descripcion?: string
  imagen_url?: string
}

export type Usuario = {
  id: string
  email: string
  nombre?: string
  apellido?: string
  direccion?: string
  ciudad?: string
  region?: string
  codigo_postal?: string
  telefono?: string
  rol: "cliente" | "admin"
  created_at: string
}

export type Pedido = {
  id: number
  usuario_id: string
  estado: "pendiente" | "pagado" | "enviado" | "entregado" | "cancelado"
  total: number
  direccion_envio: string
  ciudad_envio: string
  region_envio: string
  codigo_postal_envio: string
  metodo_pago: string
  fecha_pedido: string
  fecha_envio?: string
  fecha_entrega?: string
  notas?: string
}

export type DetallePedido = {
  id: number
  pedido_id: number
  producto_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
}

export type Resena = {
  id: number
  producto_id: number
  usuario_id: string
  calificacion: number
  comentario?: string
  fecha: string
}

export type Favorito = {
  id: number
  usuario_id: string
  producto_id: number
}

export type CarritoItem = {
  producto_id: number
  cantidad: number
  producto: Producto
}
