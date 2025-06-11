export interface CartItem {
  id: number
  nombre: string
  precio: number
  imagen_url: string
  cantidad: number
  stock: number
}

export class SimpleCart {
  private static STORAGE_KEY = "muebleria_carrito_v2"

  static getItems(): CartItem[] {
    if (typeof window === "undefined") return []

    try {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error("Error loading cart:", error)
      return []
    }
  }

  static saveItems(items: CartItem[]): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items))
      console.log("✅ Carrito guardado:", items)

      // Disparar evento personalizado para actualizar otros componentes
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: items }))
    } catch (error) {
      console.error("Error saving cart:", error)
    }
  }

  static addItem(product: Omit<CartItem, "cantidad">): void {
    const items = this.getItems()
    const existingIndex = items.findIndex((item) => item.id === product.id)

    if (existingIndex >= 0) {
      items[existingIndex].cantidad += 1
    } else {
      items.push({ ...product, precio: Math.round(product.precio), cantidad: 1 })
    }

    this.saveItems(items)
  }

  static updateQuantity(productId: number, cantidad: number): void {
    const items = this.getItems()

    if (cantidad <= 0) {
      this.removeItem(productId)
      return
    }

    const updatedItems = items.map((item) =>
      item.id === productId ? { ...item, cantidad, precio: Math.round(item.precio) } : item
    )

    this.saveItems(updatedItems)
  }

  static removeItem(productId: number): void {
    const items = this.getItems()
    const filteredItems = items.filter((item) => item.id !== productId)
    this.saveItems(filteredItems)
  }

  static clearCart(): void {
    this.saveItems([])
  }

  static getTotal(): number {
    const items = this.getItems()
    return items.reduce((total, item) => total + item.precio * item.cantidad, 0)
  }

  static getItemCount(): number {
    const items = this.getItems()
    return items.reduce((count, item) => count + item.cantidad, 0)
  }
}
