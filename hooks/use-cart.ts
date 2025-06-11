"use client"

import { useState, useEffect } from "react"
import { cartStore, type CartItem } from "@/lib/cart-store"

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Cargar carrito inicial
    const initialItems = cartStore.getCart()
    console.log("🔄 Hook useCart - Cargando items iniciales:", initialItems)
    setItems(initialItems)
    setIsLoading(false)

    // Suscribirse a cambios
    const unsubscribe = cartStore.subscribe(() => {
      const updatedItems = cartStore.getCart()
      console.log("🔄 Hook useCart - Items actualizados:", updatedItems)
      setItems(updatedItems)
    })

    return unsubscribe
  }, [])

  const addItem = (producto: CartItem["producto"], cantidad = 1) => {
    console.log("➕ Hook useCart - Agregando item:", { producto, cantidad })
    const result = cartStore.addItem(producto, cantidad)
    console.log("✅ Hook useCart - Resultado:", result)
    return result
  }

  const updateQuantity = (productoId: number, cantidad: number) => {
    console.log("🔄 Hook useCart - Actualizando cantidad:", { productoId, cantidad })
    const result = cartStore.updateQuantity(productoId, cantidad)
    console.log("✅ Hook useCart - Resultado:", result)
    return result
  }

  const removeItem = (productoId: number) => {
    console.log("🗑️ Hook useCart - Eliminando item:", productoId)
    const result = cartStore.removeItem(productoId)
    console.log("✅ Hook useCart - Resultado:", result)
    return result
  }

  const clearCart = () => {
    console.log("🧹 Hook useCart - Limpiando carrito")
    cartStore.clearCart()
  }

  const getItemCount = () => {
    const count = cartStore.getItemCount()
    console.log("🔢 Hook useCart - Conteo de items:", count)
    return count
  }

  const getTotal = () => {
    const total = cartStore.getTotal()
    console.log("💰 Hook useCart - Total:", total)
    return total
  }

  return {
    items,
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    itemCount: getItemCount(),
    total: getTotal(),
  }
}
