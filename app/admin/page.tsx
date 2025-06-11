"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Package,
  ShoppingCart,
  Mail,
  BarChart3,
  Settings,
  ArrowLeft,
  TrendingUp,
  Clock,
  DollarSign,
  Eye,
  Plus,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { getAdminStatistics } from "@/lib/actions/admin-stats"

interface AdminStats {
  totalUsuarios: number
  totalProductos: number
  pedidosPendientes: number
  ventasDelMes: number
  ultimosUsuarios: any[]
  ultimosPedidos: any[]
  error: string | null
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats>({
    totalUsuarios: 0,
    totalProductos: 0,
    pedidosPendientes: 0,
    ventasDelMes: 0,
    ultimosUsuarios: [],
    ultimosPedidos: [],
    error: null,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    try {
      const data = await getAdminStatistics()
      setStats(data)
    } catch (error) {
      console.error("Error cargando estadísticas:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      pendiente: "secondary",
      pagado: "default",
      enviado: "outline",
      entregado: "default",
      cancelado: "destructive",
    } as const

    return variants[estado as keyof typeof variants] || "secondary"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header con botón de retroceder */}
      <div className="bg-black/80 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Volver al sitio</span>
              </Button>
              <Separator orientation="vertical" className="h-6 bg-slate-700" />
              <div>
                <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
                <p className="text-sm text-slate-400">Mueblería San Bernardo</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadStats}
              className="flex items-center space-x-2 bg-slate-800 border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Actualizar</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensaje de estado */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 border border-emerald-700 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <p className="text-emerald-300 font-medium">Panel de administración activo</p>
            </div>
            <p className="text-emerald-400/80 text-sm mt-1">Todas las funciones administrativas están disponibles</p>
          </div>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-300">Total Usuarios</CardTitle>
              <Users className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalUsuarios}</div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-blue-400" />
                <p className="text-xs text-blue-300">Usuarios registrados</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-300">Productos</CardTitle>
              <Package className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.totalProductos}</div>
              <p className="text-xs text-purple-300 mt-1">En catálogo</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-amber-300">Pedidos Pendientes</CardTitle>
              <ShoppingCart className="h-5 w-5 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stats.pedidosPendientes}</div>
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="h-3 w-3 text-amber-400" />
                <p className="text-xs text-amber-300">Requieren atención</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-300">Ventas del Mes</CardTitle>
              <DollarSign className="h-5 w-5 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(stats.ventasDelMes)}</div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <p className="text-xs text-emerald-300">Ingresos generados</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sección de gestión rápida */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Acciones principales */}
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Settings className="h-5 w-5 text-slate-400" />
                <span>Gestión Principal</span>
              </CardTitle>
              <CardDescription className="text-slate-400">Acciones administrativas principales</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button asChild className="h-12 justify-start bg-zinc-800 hover:bg-zinc-700">
                  <Link href="/admin/productos" className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Productos</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 justify-start border-zinc-700 hover:bg-zinc-800 text-slate-300 hover:text-white"
                >
                  <Link href="/admin/productos/nuevo" className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Nuevo Producto</span>
                  </Link>
                </Button>
                <Button asChild className="h-12 justify-start bg-zinc-800 hover:bg-zinc-700">
                  <Link href="/admin/pedidos" className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4" />
                    <span>Pedidos</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 justify-start border-zinc-700 hover:bg-zinc-800 text-slate-300 hover:text-white"
                >
                  <Link href="/admin/usuarios" className="flex items-center space-x-2">
                    <Users className="h-4 w-4" />
                    <span>Usuarios</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Herramientas adicionales */}
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <BarChart3 className="h-5 w-5 text-slate-400" />
                <span>Herramientas</span>
              </CardTitle>
              <CardDescription className="text-slate-400">Marketing y configuración</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                asChild
                variant="outline"
                className="w-full h-12 justify-start border-zinc-700 hover:bg-zinc-800 text-slate-300 hover:text-white"
              >
                <Link href="/admin/correos" className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Marketing por Email</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full h-12 justify-start border-zinc-700 hover:bg-zinc-800 text-slate-300 hover:text-white"
              >
                <Link href="/admin/reportes" className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Reportes y Estadísticas</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full h-12 justify-start border-zinc-700 hover:bg-zinc-800 text-slate-300 hover:text-white"
              >
                <Link href="/admin/configuracion" className="flex items-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Configuración</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Actividad reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Últimos usuarios */}
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-slate-400" />
                  <span>Últimos Usuarios Registrados</span>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-zinc-800"
                >
                  <Link href="/admin/usuarios" className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>Ver todos</span>
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.ultimosUsuarios.length > 0 ? (
                  stats.ultimosUsuarios.map((usuario) => (
                    <div key={usuario.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                      <div>
                        <p className="font-medium text-white">
                          {usuario.nombre || "Sin nombre"} {usuario.apellido || ""}
                        </p>
                        <p className="text-sm text-slate-300">{usuario.email}</p>
                        <p className="text-xs text-slate-400">{formatDate(usuario.created_at)}</p>
                      </div>
                      <Badge
                        variant={usuario.rol === "admin" ? "default" : "secondary"}
                        className="bg-zinc-700 hover:bg-zinc-600"
                      >
                        {usuario.rol === "admin" ? "Admin" : "Cliente"}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-4">No hay usuarios recientes</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Últimos pedidos */}
          <Card className="bg-zinc-900 border-zinc-800 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-slate-400" />
                  <span>Últimos Pedidos</span>
                </div>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white hover:bg-zinc-800"
                >
                  <Link href="/admin/pedidos" className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>Ver todos</span>
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.ultimosPedidos.length > 0 ? (
                  stats.ultimosPedidos.map((pedido) => (
                    <div key={pedido.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                      <div>
                        <p className="font-medium text-white">Pedido #{pedido.id}</p>
                        <p className="text-sm text-slate-300">
                          {pedido.perfiles?.nombre} {pedido.perfiles?.apellido}
                        </p>
                        <p className="text-xs text-slate-400">{formatDate(pedido.fecha_pedido)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-white">{formatCurrency(pedido.total)}</p>
                        <Badge variant={getEstadoBadge(pedido.estado)}>{pedido.estado}</Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-4">No hay pedidos recientes</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
