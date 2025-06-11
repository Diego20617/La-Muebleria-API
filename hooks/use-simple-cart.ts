"use client"

import { useState, useEffect } from "react"
import { SimpleCart, type CartItem } from "@/lib/simple-cart"

export function useSimpleCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [itemCount, setItemCount] = useState(0)

  const loadCart = () => {
    const cartItems = SimpleCart.getItems()
    setItems(cartItems)
    setTotal(SimpleCart.getTotal())
    setItemCount(SimpleCart.getItemCount())
    setIsLoading(false)
  }

  useEffect(() => {
    loadCart()

    // Escuchar cambios en el carrito
    const handleCartUpdate = (event: CustomEvent) => {
      setItems(event.detail)
      setTotal(SimpleCart.getTotal())
      setItemCount(SimpleCart.getItemCount())
    }

    window.addEventListener("cartUpdated", handleCartUpdate as EventListener)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate as EventListener)
    }
  }, [])

  const addItem = (product: Omit<CartItem, "cantidad">) => {
    SimpleCart.addItem(product)
  }

  const updateQuantity = (productId: number, cantidad: number) => {
    SimpleCart.updateQuantity(productId, cantidad)
  }

  const removeItem = (productId: number) => {
    SimpleCart.removeItem(productId)
  }

  const clearCart = () => {
    SimpleCart.clearCart()
  }

  return {
    items,
    isLoading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    total,
    itemCount,
    reload: loadCart,
  }
}
