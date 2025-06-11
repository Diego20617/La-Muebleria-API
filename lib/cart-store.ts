"use client"

interface CartItem {
  producto_id: number
  cantidad: number
  producto: {
    id: number
    nombre: string
    precio: number
    imagen_url: string
    stock: number
  }
}

class CartStore {
  private static instance: CartStore
  private listeners: (() => void)[] = []

  static getInstance(): CartStore {
    if (!CartStore.instance) {
      CartStore.instance = new CartStore()
      console.log("🏪 CartStore - Nueva instancia creada")
    }
    return CartStore.instance
  }

  // Obtener carrito
  getCart(): CartItem[] {
    if (typeof window === "undefined") {
      console.log("🏪 CartStore - Window undefined, retornando array vacío")
      return []
    }

    try {
      const cartData = localStorage.getItem("muebleria_carrito")
      console.log("🏪 CartStore - Datos del localStorage:", cartData)

      if (!cartData) {
        console.log("🏪 CartStore - No hay datos en localStorage")
        return []
      }

      const items = JSON.parse(cartData)
      const validItems = Array.isArray(items) ? items : []
      console.log("🏪 CartStore - Items válidos:", validItems)
      return validItems
    } catch (error) {
      console.error("🏪 CartStore - Error al obtener carrito:", error)
      return []
    }
  }

  // Guardar carrito
  private saveCart(items: CartItem[]): void {
    if (typeof window === "undefined") {
      console.log("🏪 CartStore - Window undefined, no se puede guardar")
      return
    }

    try {
      const dataToSave = JSON.stringify(items)
      localStorage.setItem("muebleria_carrito", dataToSave)
      console.log("🏪 CartStore - Carrito guardado:", dataToSave)
      this.notifyListeners()
    } catch (error) {
      console.error("🏪 CartStore - Error al guardar carrito:", error)
    }
  }

  // Agregar producto
  addItem(producto: CartItem["producto"], cantidad = 1): { success: boolean; message: string } {
    console.log("🏪 CartStore - Agregando item:", { producto, cantidad })

    try {
      const items = this.getCart()
      console.log("🏪 CartStore - Items actuales:", items)

      const existingIndex = items.findIndex((item) => item.producto_id === producto.id)
      console.log("🏪 CartStore - Índice existente:", existingIndex)

      if (existingIndex >= 0) {
        const newQuantity = items[existingIndex].cantidad + cantidad
        console.log("🏪 CartStore - Nueva cantidad:", newQuantity)

        if (newQuantity > producto.stock) {
          return {
            success: false,
            message: `Solo puedes agregar ${producto.stock - items[existingIndex].cantidad} unidades más`,
          }
        }
        items[existingIndex].cantidad = newQuantity
      } else {
        if (cantidad > producto.stock) {
          return {
            success: false,
            message: `Solo hay ${producto.stock} unidades disponibles`,
          }
        }

        const newItem = {
          producto_id: producto.id,
          cantidad,
          producto,
        }
        console.log("🏪 CartStore - Nuevo item a agregar:", newItem)
        items.push(newItem)
      }

      console.log("🏪 CartStore - Items finales antes de guardar:", items)
      this.saveCart(items)

      return {
        success: true,
        message: `${producto.nombre} agregado al carrito`,
      }
    } catch (error) {
      console.error("🏪 CartStore - Error al agregar producto:", error)
      return {
        success: false,
        message: "Error al agregar producto al carrito",
      }
    }
  }

  // Actualizar cantidad
  updateQuantity(productoId: number, cantidad: number): { success: boolean; message: string } {
    console.log("🏪 CartStore - Actualizando cantidad:", { productoId, cantidad })

    try {
      const items = this.getCart()
      const itemIndex = items.findIndex((item) => item.producto_id === productoId)

      if (itemIndex === -1) {
        return {
          success: false,
          message: "Producto no encontrado en el carrito",
        }
      }

      if (cantidad <= 0) {
        items.splice(itemIndex, 1)
        this.saveCart(items)
        return {
          success: true,
          message: "Producto eliminado del carrito",
        }
      }

      if (cantidad > items[itemIndex].producto.stock) {
        return {
          success: false,
          message: `Solo hay ${items[itemIndex].producto.stock} unidades disponibles`,
        }
      }

      items[itemIndex].cantidad = cantidad
      this.saveCart(items)
      return {
        success: true,
        message: "Cantidad actualizada",
      }
    } catch (error) {
      console.error("🏪 CartStore - Error al actualizar cantidad:", error)
      return {
        success: false,
        message: "Error al actualizar cantidad",
      }
    }
  }

  // Eliminar producto
  removeItem(productoId: number): { success: boolean; message: string } {
    return this.updateQuantity(productoId, 0)
  }

  // Vaciar carrito
  clearCart(): void {
    console.log("🏪 CartStore - Limpiando carrito")
    this.saveCart([])
  }

  // Obtener total de items
  getItemCount(): number {
    const count = this.getCart().reduce((total, item) => total + item.cantidad, 0)
    console.log("🏪 CartStore - Conteo total:", count)
    return count
  }

  // Obtener total de precio
  getTotal(): number {
    const total = this.getCart().reduce((total, item) => total + item.producto.precio * item.cantidad, 0)
    console.log("🏪 CartStore - Total precio:", total)
    return total
  }

  // Suscribirse a cambios
  subscribe(listener: () => void): () => void {
    console.log("🏪 CartStore - Nueva suscripción")
    this.listeners.push(listener)
    return () => {
      console.log("🏪 CartStore - Cancelando suscripción")
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  // Notificar cambios
  private notifyListeners(): void {
    console.log("🏪 CartStore - Notificando a", this.listeners.length, "listeners")
    this.listeners.forEach((listener) => listener())
  }
}

export const cartStore = CartStore.getInstance()
export type { CartItem }
