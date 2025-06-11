"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface CartItem {
  id: number
  nombre: string
  precio: number
  imagen_url: string
  cantidad: number
  stock: number
}

export default function CarritoSimplePage() {
  const { toast } = useToast()
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = () => {
    try {
      const savedCart = localStorage.getItem("carrito_simple")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setItems(parsedCart)
        console.log("✅ Carrito cargado:", parsedCart)
      }
    } catch (error) {
      console.error("Error cargando carrito:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveCart = (newItems: CartItem[]) => {
    try {
      localStorage.setItem("carrito_simple", JSON.stringify(newItems))
      setItems(newItems)
      console.log("✅ Carrito guardado:", newItems)
    } catch (error) {
      console.error("Error guardando carrito:", error)
    }
  }

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }

    const newItems = items.map((item) => (item.id === id ? { ...item, cantidad: newQuantity } : item))

    saveCart(newItems)

    toast({
      title: "Cantidad actualizada",
      description: "La cantidad del producto ha sido actualizada",
    })
  }

  const removeItem = (id: number) => {
    const newItems = items.filter((item) => item.id !== id)
    saveCart(newItems)

    toast({
      title: "Producto eliminado",
      description: "El producto ha sido eliminado del carrito",
    })
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio)
  }

  const total = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0)
  const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando carrito...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Carrito Simple</h1>
          {itemCount > 0 && (
            <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              {itemCount} productos
            </span>
          )}
        </div>

        {/* Estado del carrito */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Sistema:</span>
                <span className="text-sm px-2 py-1 rounded bg-blue-100 text-blue-800">Solo LocalStorage</span>
              </div>
              <div className="text-sm text-blue-700">✅ Carrito simple funcionando</div>
            </div>
          </CardContent>
        </Card>

        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <ShoppingBag className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Agrega productos usando el botón "Agregar al carrito simple" en cualquier producto
              </p>
              <Button size="lg" asChild>
                <Link href="/">Explorar Productos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lista de productos */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.imagen_url || "/placeholder.svg?height=96&width=96"}
                          alt={item.nombre}
                          width={96}
                          height={96}
                          className="object-cover w-full h-full"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1 truncate">{item.nombre}</h3>
                        <p className="text-muted-foreground text-lg">{formatearPrecio(item.precio)}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <Input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value)
                            if (value >= 0) {
                              updateQuantity(item.id, value)
                            }
                          }}
                          className="w-20 text-center"
                          min="0"
                        />

                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-xl mb-2">{formatearPrecio(item.precio * item.cantidad)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="text-xl">Resumen del Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="truncate mr-2">
                          {item.nombre} x{item.cantidad}
                        </span>
                        <span className="font-medium">{formatearPrecio(item.precio * item.cantidad)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">{formatearPrecio(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío:</span>
                      <span className="text-green-600 font-medium">Gratis</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA (19%):</span>
                      <span className="font-medium">{formatearPrecio(total * 0.19)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between font-bold text-xl">
                      <span>Total:</span>
                      <span className="text-primary">{formatearPrecio(total * 1.19)}</span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/checkout">Proceder al Pago</Link>
                    </Button>

                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/">Seguir Comprando</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
