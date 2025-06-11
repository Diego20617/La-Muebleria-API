"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Plus, Minus, Check, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SimpleCart } from "@/lib/simple-cart"

interface AddToCartButtonProps {
  producto: {
    id: number
    nombre: string
    precio: number
    imagen_url: string
    stock: number
  }
  className?: string
}

export function AddToCartButton({ producto, className = "" }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { toast } = useToast()

  const handleAddToCart = async () => {
    console.log("AddToCartButton: Clic en el botón Agregar.")
    console.log("AddToCartButton: Estado actual - isAdding:", isAdding, "isAdded:", isAdded)
    console.log("AddToCartButton: Producto a agregar:", producto)
    console.log("AddToCartButton: Cantidad a agregar:", quantity)

    if (isAdding || producto.stock === 0) return

    setIsAdding(true)
    console.log("AddToCartButton: isAdding establecido a true.")

    try {
      // Simular un pequeño delay para mejor UX
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Agregar múltiples cantidades
      for (let i = 0; i < quantity; i++) {
        SimpleCart.addItem({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen_url: producto.imagen_url,
          stock: producto.stock,
        })
      }

      setIsAdded(true)

      toast({
        title: "¡Producto agregado!",
        description: `${producto.nombre} (${quantity}) agregado al carrito`,
      })

      console.log(`✅ Agregado al carrito: ${producto.nombre} x${quantity}`)

      // Resetear después de 2 segundos
      setTimeout(() => {
        setIsAdded(false)
        setQuantity(1)
        console.log("AddToCartButton: Resetear estado después de 2 segundos.")
      }, 2000)
    } catch (error) {
      console.error("Error agregando al carrito (AddToCartButton):", error)
      toast({
        title: "Error",
        description: "No se pudo agregar el producto al carrito",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
      console.log("AddToCartButton: isAdding establecido a false en finally.")
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Selector de cantidad */}
      <div className="flex items-center justify-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1 || isAdding}
          data-testid="minus-button"
          aria-label="minus"
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span data-testid="quantity-display" className="w-12 text-center font-semibold text-lg">{quantity}</span>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity(Math.min(quantity + 1))}
          disabled={isAdding}
          data-testid="plus-button"
          aria-label="plus"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      {/* Botón principal */}
      <Button
        onClick={handleAddToCart}
        disabled={isAdding || isAdded || producto.stock === 0}
        className="w-full h-12 text-base font-semibold"
        size="lg"
        data-testid="add-to-cart-button"
      >
        {isAdding ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Agregando...
          </span>
        ) : isAdded ? (
          <span className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            ¡Agregado al Carrito!
          </span>
        ) : producto.stock === 0 ? (
          <span className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Sin Stock
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Agregar al Carrito
          </span>
        )}
      </Button>

      {/* Información de stock */}
      {producto.stock <= 5 && producto.stock > 0 && (
        <p className="text-sm text-amber-600 text-center">⚠️ Solo quedan {producto.stock} unidades</p>
      )}

      {producto.stock === 0 && <p className="text-sm text-red-600 text-center font-medium">❌ Producto agotado</p>}
    </div>
  )
}
