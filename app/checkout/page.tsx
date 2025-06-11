"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CreditCard, MapPin, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [perfil, setPerfil] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState(false)
  const [formData, setFormData] = useState({
    direccion: "",
    ciudad: "",
    region: "",
    codigo_postal: "",
    metodo_pago: "",
    notas: "",
  })
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) return

    try {
      // Cargar carrito
      const { data: carritoData } = await supabase
        .from("carrito")
        .select(`
          *,
          productos (*)
        `)
        .eq("usuario_id", user.id)

      setItems(carritoData || [])

      // Cargar perfil
      const { data: perfilData } = await supabase.from("perfiles").select("*").eq("id", user.id).single()

      if (perfilData) {
        setPerfil(perfilData)
        setFormData({
          direccion: perfilData.direccion || "",
          ciudad: perfilData.ciudad || "",
          region: perfilData.region || "",
          codigo_postal: perfilData.codigo_postal || "",
          metodo_pago: "",
          notas: "",
        })
      }
    } catch (error) {
      console.error("Error cargando datos:", error)
    } finally {
      setLoading(false)
    }
  }

  const calcularTotal = () => {
    return items.reduce((total, item) => total + item.productos.precio * item.cantidad, 0)
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || items.length === 0) return

    setProcesando(true)

    try {
      // Crear pedido
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .insert({
          usuario_id: user.id,
          total: calcularTotal(),
          direccion_envio: formData.direccion,
          ciudad_envio: formData.ciudad,
          region_envio: formData.region,
          codigo_postal_envio: formData.codigo_postal,
          metodo_pago: formData.metodo_pago,
          notas: formData.notas,
          estado: "pendiente",
        })
        .select()
        .single()

      if (pedidoError) {
        throw new Error(pedidoError.message)
      }

      // Crear detalles del pedido
      const detalles = items.map((item) => ({
        pedido_id: pedido.id,
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precio_unitario: item.productos.precio,
        subtotal: item.productos.precio * item.cantidad,
      }))

      const { error: detallesError } = await supabase.from("detalles_pedido").insert(detalles)

      if (detallesError) {
        throw new Error(detallesError.message)
      }

      // Actualizar stock
      for (const item of items) {
        await supabase.rpc("actualizar_stock", {
          p_producto_id: item.producto_id,
          p_cantidad: item.cantidad,
        })
      }

      // Vaciar carrito
      await supabase.from("carrito").delete().eq("usuario_id", user.id)

      toast({
        title: "Pedido realizado exitosamente",
        description: `Tu pedido #${pedido.id} ha sido creado`,
      })

      router.push(`/pedidos/${pedido.id}`)
    } catch (error) {
      console.error("Error procesando pedido:", error)
      toast({
        title: "Error",
        description: "No se pudo procesar el pedido",
        variant: "destructive",
      })
    } finally {
      setProcesando(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Checkout</h2>
          <p className="mb-4">Debes iniciar sesión para realizar una compra.</p>
          <Button asChild>
            <Link href="/auth/login">Iniciar Sesión</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Carrito Vacío</h2>
          <p className="mb-4">No tienes productos en tu carrito.</p>
          <Button asChild>
            <Link href="/">Ver Productos</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Finalizar Compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Formulario */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información de envío */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Información de Envío
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="direccion">Dirección *</Label>
                    <Input
                      id="direccion"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      placeholder="Calle, número, departamento"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ciudad">Ciudad *</Label>
                      <Input
                        id="ciudad"
                        value={formData.ciudad}
                        onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                        placeholder="Ciudad"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="region">Región *</Label>
                      <Select
                        value={formData.region}
                        onValueChange={(value) => setFormData({ ...formData, region: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar región" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="metropolitana">Región Metropolitana</SelectItem>
                          <SelectItem value="valparaiso">Valparaíso</SelectItem>
                          <SelectItem value="biobio">Biobío</SelectItem>
                          <SelectItem value="araucania">La Araucanía</SelectItem>
                          <SelectItem value="los-lagos">Los Lagos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="codigo_postal">Código Postal</Label>
                    <Input
                      id="codigo_postal"
                      value={formData.codigo_postal}
                      onChange={(e) => setFormData({ ...formData, codigo_postal: e.target.value })}
                      placeholder="Código postal"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Método de pago */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Método de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={formData.metodo_pago}
                    onValueChange={(value) => setFormData({ ...formData, metodo_pago: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar método de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                      <SelectItem value="tarjeta_credito">Tarjeta de Crédito</SelectItem>
                      <SelectItem value="tarjeta_debito">Tarjeta de Débito</SelectItem>
                      <SelectItem value="efectivo">Efectivo (Contra entrega)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Notas adicionales */}
              <Card>
                <CardHeader>
                  <CardTitle>Notas Adicionales</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    placeholder="Instrucciones especiales para la entrega..."
                    rows={3}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Resumen del pedido */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Resumen del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Productos */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <Image
                          src={item.productos.imagen_url || "/placeholder.svg"}
                          alt={item.productos.nombre}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.productos.nombre}</p>
                          <p className="text-xs text-muted-foreground">Cantidad: {item.cantidad}</p>
                        </div>
                        <p className="font-medium text-sm">{formatearPrecio(item.productos.precio * item.cantidad)}</p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totales */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatearPrecio(calcularTotal())}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Envío:</span>
                      <span className="text-green-600">Gratis</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>{formatearPrecio(calcularTotal())}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" size="lg" disabled={procesando}>
                    {procesando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Procesando...
                      </>
                    ) : (
                      "Realizar Pedido"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Al realizar el pedido, aceptas nuestros términos y condiciones
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
