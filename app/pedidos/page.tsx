"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function PedidosPage() {
  const { user } = useAuth()
  const [pedidos, setPedidos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      loadPedidos()
    }
  }, [user])

  const loadPedidos = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("pedidos")
        .select(`
          *,
          detalles_pedido (
            *,
            productos (nombre, imagen_url)
          )
        `)
        .eq("usuario_id", user.id)
        .order("fecha_pedido", { ascending: false })

      if (error) {
        console.error("Error cargando pedidos:", error)
      } else {
        setPedidos(data || [])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio)
  }

  const getEstadoBadge = (estado: string) => {
    const estados = {
      pendiente: { color: "bg-yellow-500", icon: Package, label: "Pendiente" },
      pagado: { color: "bg-blue-500", icon: CheckCircle, label: "Pagado" },
      enviado: { color: "bg-purple-500", icon: Truck, label: "Enviado" },
      entregado: { color: "bg-green-500", icon: CheckCircle, label: "Entregado" },
      cancelado: { color: "bg-red-500", icon: XCircle, label: "Cancelado" },
    }

    const estadoInfo = estados[estado as keyof typeof estados] || estados.pendiente
    const Icon = estadoInfo.icon

    return (
      <Badge className={`${estadoInfo.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {estadoInfo.label}
      </Badge>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Mis Pedidos</h2>
          <p className="mb-4">Debes iniciar sesión para ver tus pedidos.</p>
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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>

        {pedidos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">No tienes pedidos aún</h2>
              <p className="text-muted-foreground mb-6">Cuando realices tu primera compra, aparecerá aquí</p>
              <Button asChild>
                <Link href="/">Explorar Productos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
          <div className="space-y-6">
            {pedidos.map((pedido) => (
              <Card key={pedido.id} className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Pedido #{pedido.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Realizado el {new Date(pedido.fecha_pedido).toLocaleDateString("es-CL")}
                      </p>
                    </div>
                    <div className="text-right">
                      {getEstadoBadge(pedido.estado)}
                      <p className="text-lg font-bold mt-2">{formatearPrecio(pedido.total)}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Productos del pedido */}
                    <div>
                      <h4 className="font-semibold mb-2">Productos ({pedido.detalles_pedido?.length || 0})</h4>
                      <div className="space-y-2">
                        {pedido.detalles_pedido?.slice(0, 3).map((detalle: any) => (
                          <div key={detalle.id} className="flex items-center gap-3 text-sm">
                            <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">📦</div>
                            <div className="flex-1">
                              <p className="font-medium">{detalle.productos?.nombre}</p>
                              <p className="text-muted-foreground">
                                Cantidad: {detalle.cantidad} × {formatearPrecio(detalle.precio_unitario)}
                              </p>
                            </div>
                            <p className="font-medium">{formatearPrecio(detalle.subtotal)}</p>
                          </div>
                        ))}
                        {(pedido.detalles_pedido?.length || 0) > 3 && (
                          <p className="text-sm text-muted-foreground">
                            +{(pedido.detalles_pedido?.length || 0) - 3} productos más
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Información de envío */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold mb-2">Información de Envío</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Dirección:</p>
                          <p>{pedido.direccion_envio}</p>
                          <p>
                            {pedido.ciudad_envio}, {pedido.region_envio}
                          </p>
                          <p>{pedido.codigo_postal_envio}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Método de Pago:</p>
                          <p className="capitalize">{pedido.metodo_pago}</p>
                          {pedido.fecha_envio && (
                            <>
                              <p className="text-muted-foreground mt-2">Fecha de Envío:</p>
                              <p>{new Date(pedido.fecha_envio).toLocaleDateString("es-CL")}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="border-t pt-4 flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/pedidos/${pedido.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Link>
                      </Button>
                      {pedido.estado === "pendiente" && (
                        <Button variant="outline" size="sm">
                          Cancelar Pedido
                        </Button>
                      )}
                      {pedido.estado === "entregado" && (
                        <Button variant="outline" size="sm">
                          Volver a Comprar
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Button asChild size="lg">
              <Link href="/">Volver al inicio</Link>
            </Button>
          </div>
          </>
        )}
      </div>
    </div>
  )
}
