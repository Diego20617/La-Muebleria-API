"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, RefreshCw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useSimpleCart } from "@/hooks/use-simple-cart"
import { useToast } from "@/hooks/use-toast"
import { StripePaymentButton } from "@/components/stripe-payment-button"
import { useAuth } from "@/components/auth-provider"

export default function CarritoPage() {
  const { items, isLoading, updateQuantity, removeItem, clearCart, total, itemCount, reload } = useSimpleCart()
  const { user } = useAuth()

  const { toast } = useToast()

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0, // Para COP, generalmente no hay decimales
    }).format(precio)
  }

  const handleClearCart = () => {
    clearCart()
    toast({
      title: "Carrito vaciado",
      description: "Todos los productos han sido eliminados del carrito",
    })
  }

  const subtotal = total
  const iva = subtotal * 0.19
  const totalConIva = subtotal + iva

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg">Cargando carrito...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Mi Carrito</h1>
          {itemCount > 0 && (
            <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
              {itemCount} productos
            </span>
          )}
        </div>

        {/* Estado del sistema */}
        <Card className="mb-6 bg-green-50 border-green-200">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="font-medium">Sistema de Carrito Activo</span>
                <span className="text-sm px-2 py-1 rounded bg-green-100 text-green-800">LocalStorage</span>
              </div>
              <Button variant="outline" size="sm" onClick={reload}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Recargar
              </Button>
            </div>
          </CardContent>
        </Card>

        {items.length === 0 ? (
          <Card>
            <CardContent className="text-center py-20">
              <ShoppingBag className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
              <h2 className="text-2xl font-semibold mb-4">Tu carrito está vacío</h2>
              <p className="text-muted-foreground mb-8 text-lg max-w-md mx-auto">
                Descubre nuestros increíbles productos y comienza a llenar tu carrito
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Productos ({items.length})</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Vaciar Carrito
                </Button>
              </div>

              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-6">
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
                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.nombre}</h3>
                        <p className="text-muted-foreground text-lg">{formatearPrecio(item.precio)}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>

                        <Input
                          type="number"
                          value={item.cantidad}
                          onChange={(e) => {
                            const value = Number.parseInt(e.target.value)
                            if (value >= 1) {
                              updateQuantity(item.id, value)
                            }
                          }}
                          className="w-20 text-center"
                          min="1"
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
                        <p className="font-bold text-xl mb-3">{formatearPrecio(item.precio * item.cantidad)}</p>
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

                  <Separator />

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-medium">{formatearPrecio(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío:</span>
                      <span className="text-green-600 font-medium">Gratis</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IVA (19%):</span>
                      <span className="font-medium">{formatearPrecio(iva)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold text-xl">
                    <span>Total:</span>
                    <span className="text-primary">{formatearPrecio(totalConIva)}</span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <StripePaymentButton
                      amount={Math.round(totalConIva)}
                      description="Compra en Mueblería San Bernardo"
                      items={items.map(item => ({
                        id: item.id,
                        nombre: item.nombre,
                        precio: Math.round(item.precio),
                        imagen_url: item.imagen_url,
                        cantidad: item.cantidad,
                      }))}
                      orderId={`ORDER-${Date.now()}`}
                      userId={user?.id}
                      className="w-full"
                      onSuccess={() => {
                        clearCart();
                        toast({
                          title: "¡Pago Completado!",
                          description: "Gracias por tu compra. Redirigiendo a la página de éxito...",
                        });
                      }}
                    />

                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/">Seguir Comprando</Link>
                    </Button>
                  </div>

                  <div className="text-xs text-muted-foreground text-center pt-4">
                    ✅ Carrito guardado localmente
                    <br />
                    Los productos se mantienen al recargar la página
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
