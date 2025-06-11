"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Package, ExternalLink } from "lucide-react"
import Link from "next/link"

interface Pedido {
  id: number
  fecha_pedido: string
  estado: string
  total: number
  items: number
}

export function PedidosModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [pedidos, setPedidos] = useState<Pedido[]>([])

  useEffect(() => {
    if (open) {
      loadPedidos()
    }
  }, [open])

  const loadPedidos = async () => {
    setLoading(true)
    try {
      // Simulamos la carga de pedidos (en producción, esto sería una llamada API real)
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Datos de ejemplo
      setPedidos([
        {
          id: 1001,
          fecha_pedido: "2025-06-01T14:30:00",
          estado: "entregado",
          total: 149990,
          items: 2,
        },
        {
          id: 1002,
          fecha_pedido: "2025-06-05T10:15:00",
          estado: "pendiente",
          total: 89990,
          items: 1,
        },
        {
          id: 1003,
          fecha_pedido: "2025-06-07T16:45:00",
          estado: "pagado",
          total: 299990,
          items: 3,
        },
      ])
    } catch (error) {
      console.error("Error cargando pedidos:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar tus pedidos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "pendiente":
        return <Badge variant="secondary">Pendiente</Badge>
      case "pagado":
        return <Badge variant="default">Pagado</Badge>
      case "enviado":
        return <Badge variant="outline">Enviado</Badge>
      case "entregado":
        return <Badge variant="success">Entregado</Badge>
      case "cancelado":
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="outline">{estado}</Badge>
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Mis Pedidos</DialogTitle>
          <DialogDescription>Historial de tus pedidos recientes</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="py-4">
            {pedidos.length > 0 ? (
              <div className="space-y-4">
                {pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Pedido #{pedido.id}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(pedido.fecha_pedido)}</p>
                        <div className="mt-1">{getEstadoBadge(pedido.estado)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(pedido.total)}</p>
                      <p className="text-sm text-muted-foreground">
                        {pedido.items} {pedido.items === 1 ? "producto" : "productos"}
                      </p>
                      <Button variant="ghost" size="sm" asChild className="mt-1">
                        <Link href={`/pedidos/${pedido.id}`} className="flex items-center gap-1">
                          <span>Detalles</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center mt-4">
                  <Button asChild variant="outline">
                    <Link href="/pedidos">Ver todos mis pedidos</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-lg font-medium">No tienes pedidos</h3>
                <p className="text-muted-foreground mb-4">Aún no has realizado ningún pedido</p>
                <Button asChild>
                  <Link href="/productos">Explorar productos</Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
