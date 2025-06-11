"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"

interface CartButtonProps {
  productId: number
  productName: string
  stock: number
  className?: string
}

export function CartButton({ productId, productName, stock, className }: CartButtonProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isAdding, setIsAdding] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar productos al carrito",
        variant: "destructive",
      })
      return
    }

    if (stock === 0) {
      toast({
        title: "Sin stock",
        description: "Este producto no tiene stock disponible",
        variant: "destructive",
      })
      return
    }

    setIsAdding(true)

    try {
      const response = await fetch("/api/carrito/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productoId: productId,
          cantidad: quantity,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "¡Agregado al carrito!",
          description: `${quantity} ${productName} ${quantity === 1 ? "agregado" : "agregados"} al carrito`,
        })

        // Disparar evento personalizado para actualizar el contador del carrito
        window.dispatchEvent(new CustomEvent("cartUpdated"))
      } else {
        toast({
          title: "Error",
          description: result.error || "No se pudo agregar el producto",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al agregar el producto",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          disabled={quantity <= 1}
          aria-label="minus"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <input
          type="number"
          value={quantity}
          min={1}
          max={stock}
          onChange={e => {
            const value = Number(e.target.value)
            if (!isNaN(value) && value >= 1 && value <= stock) {
              setQuantity(value)
            }
          }}
          className="w-8 text-center font-medium border rounded h-10"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setQuantity(Math.min(stock, quantity + 1))}
          disabled={quantity >= stock}
          aria-label="plus"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button onClick={handleAddToCart} disabled={isAdding || stock === 0} className="w-full">
        {isAdding ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Agregando...
          </>
        ) : (
          <>
            <ShoppingCart className="h-4 w-4 mr-2" />
            {stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
          </>
        )}
      </Button>
    </div>
  )
}
