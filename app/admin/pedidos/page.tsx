"use client"

import { useState, useEffect } from "react"
import { Eye, Package, Truck, CheckCircle, XCircle, Search } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin-header"
import { useAuth } from "@/components/auth-provider"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function AdminPedidosPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [pedidos, setPedidos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      loadPedidos()
    }
  }, [user])

  const loadPedidos = async () => {
    try {
      const { data, error } = await supabase
        .from("pedidos")
        .select(`
        *,
        perfiles (nombre, apellido),
        detalles_pedido (
          *,
          productos (nombre, imagen_url)
        )
      `)
        .order("fecha_pedido", { ascending: false })

      if (error) {
        console.error("Error cargando pedidos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los pedidos",
          variant: "destructive",
        })
      } else {
        setPedidos(data || [])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const actualizarEstadoPedido = async (pedidoId: number, nuevoEstado: string) => {
    try {
      const { error } = await supabase
        .from("pedidos")
        .update({
          estado: nuevoEstado,
          fecha_envio: nuevoEstado === "enviado" ? new Date().toISOString() : null,
          fecha_entrega: nuevoEstado === "entregado" ? new Date().toISOString() : null,
        })
        .eq("id", pedidoId)

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar el estado del pedido",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Estado actualizado",
          description: `El pedido ha sido marcado como ${nuevoEstado}`,
        })
        loadPedidos()
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el pedido",
        variant: "destructive",
      })
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
      pendiente: { color: "bg-zinc-700", icon: Package, label: "Pendiente" },
      pagado: { color: "bg-zinc-800", icon: CheckCircle, label: "Pagado" },
      enviado: { color: "bg-zinc-700", icon: Truck, label: "Enviado" },
      entregado: { color: "bg-zinc-800", icon: CheckCircle, label: "Entregado" },
      cancelado: { color: "bg-zinc-900 border border-red-900 text-red-400", icon: XCircle, label: "Cancelado" },
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

  const pedidosFiltrados = pedidos.filter((pedido) => {
    const coincideBusqueda =
      pedido.id.toString().includes(busqueda) ||
      pedido.usuario_id?.toLowerCase().includes(busqueda.toLowerCase()) ||
      `${pedido.perfiles?.nombre || ""} ${pedido.perfiles?.apellido || ""}`
        .toLowerCase()
        .includes(busqueda.toLowerCase())

    const coincideEstado = filtroEstado === "todos" || pedido.estado === filtroEstado

    return coincideBusqueda && coincideEstado
  })

  if (!user || user.email !== "admin@muebleriasanbernardo.cl") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Acceso Denegado</h2>
          <p>No tienes permisos para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <AdminHeader title="Gestionar Pedidos" description="Administra todos los pedidos de la tienda" backUrl="/admin" />

      <div className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por ID, email o nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los estados</SelectItem>
              <SelectItem value="pendiente">Pendiente</SelectItem>
              <SelectItem value="pagado">Pagado</SelectItem>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="entregado">Entregado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de pedidos */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidosFiltrados.map((pedido) => (
              <Card key={pedido.id} className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">Pedido #{pedido.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {pedido.perfiles?.nombre || "Usuario"} {pedido.perfiles?.apellido || ""}
                      </p>
                      <p className="text-xs text-muted-foreground">ID: {pedido.usuario_id}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(pedido.fecha_pedido).toLocaleDateString("es-CL", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
                    {/* Productos */}
                    <div>
                      <h4 className="font-semibold mb-2">Productos ({pedido.detalles_pedido?.length || 0})</h4>
                      <div className="space-y-2">
                        {pedido.detalles_pedido?.slice(0, 2).map((detalle: any) => (
                          <div key={detalle.id} className="flex items-center gap-3 text-sm">
                            <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">📦</div>
                            <div className="flex-1">
                              <p className="font-medium">{detalle.productos?.nombre}</p>
                              <p className="text-muted-foreground">
                                {detalle.cantidad} × {formatearPrecio(detalle.precio_unitario)}
                              </p>
                            </div>
                            <p className="font-medium">{formatearPrecio(detalle.subtotal)}</p>
                          </div>
                        ))}
                        {(pedido.detalles_pedido?.length || 0) > 2 && (
                          <p className="text-sm text-muted-foreground">
                            +{(pedido.detalles_pedido?.length || 0) - 2} productos más
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
                          <p className="capitalize">{pedido.metodo_pago.replace("_", " ")}</p>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="border-t pt-4 flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/pedidos/${pedido.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Link>
                      </Button>

                      {pedido.estado === "pendiente" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => actualizarEstadoPedido(pedido.id, "pagado")}
                          >
                            Marcar como Pagado
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => actualizarEstadoPedido(pedido.id, "cancelado")}
                            className="text-red-600"
                          >
                            Cancelar
                          </Button>
                        </>
                      )}

                      {pedido.estado === "pagado" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actualizarEstadoPedido(pedido.id, "enviado")}
                        >
                          Marcar como Enviado
                        </Button>
                      )}

                      {pedido.estado === "enviado" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => actualizarEstadoPedido(pedido.id, "entregado")}
                        >
                          Marcar como Entregado
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {pedidosFiltrados.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No se encontraron pedidos</h3>
            <p className="text-muted-foreground">
              {busqueda || filtroEstado !== "todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay pedidos registrados aún"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
