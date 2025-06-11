"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SimpleAddToCartProps {
  productId: number
  productName: string
  productPrice: number
  productImage: string
  stock: number
  className?: string
}

export function SimpleAddToCart({
  productId,
  productName,
  productPrice,
  productImage,
  stock,
  className = "",
}: SimpleAddToCartProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { toast } = useToast()

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1)
    }
  }

  const handleAddToCart = () => {
    if (isAdding || stock === 0) return

    setIsAdding(true)

    try {
      // Obtener carrito actual
      const savedCart = localStorage.getItem("carrito_simple")
      const currentCart = savedCart ? JSON.parse(savedCart) : []

      // Buscar si el producto ya existe
      const existingItemIndex = currentCart.findIndex((item: any) => item.id === productId)

      if (existingItemIndex >= 0) {
        // Actualizar cantidad
        currentCart[existingItemIndex].cantidad += quantity
      } else {
        // Agregar nuevo producto
        currentCart.push({
          id: productId,
          nombre: productName,
          precio: productPrice,
          imagen_url: productImage,
          cantidad: quantity,
          stock: stock,
        })
      }

      // Guardar carrito
      localStorage.setItem("carrito_simple", JSON.stringify(currentCart))

      setIsAdded(true)
      toast({
        title: "¡Producto agregado!",
        description: `${productName} agregado al carrito simple`,
      })

      // Resetear estado después de 2 segundos
      setTimeout(() => {
        setIsAdded(false)
        setQuantity(1)
      }, 2000)

      console.log("✅ Producto agregado al carrito simple:", {
        id: productId,
        nombre: productName,
        cantidad: quantity,
      })
    } catch (error) {
      console.error("Error agregando al carrito simple:", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1 || isAdding}>
          <Minus className="h-4 w-4" />
        </Button>

        <span className="w-8 text-center font-medium">{quantity}</span>

        <Button variant="outline" size="icon" onClick={increaseQuantity} disabled={quantity >= stock || isAdding}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button onClick={handleAddToCart} disabled={isAdding || stock === 0 || isAdded} className="w-full">
        {isAdding ? (
          <span className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Agregando...
          </span>
        ) : isAdded ? (
          <span className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            ¡Agregado!
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Carrito Simple
          </span>
        )}
      </Button>

      <Button variant="outline" size="sm" asChild className="text-xs">
        <a href="/carrito-simple">Ver Carrito Simple</a>
      </Button>

      {stock <= 5 && stock > 0 && <p className="text-xs text-amber-600">¡Solo quedan {stock} unidades!</p>}

      {stock === 0 && <p className="text-xs text-red-600">Producto agotado</p>}
    </div>
  )
}
