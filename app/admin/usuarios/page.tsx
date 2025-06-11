"use client"

import { useState, useEffect } from "react"
import { Search, Shield, User, Calendar, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin-header"
import { useAuth } from "@/components/auth-provider"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function AdminUsuariosPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const [filtroRol, setFiltroRol] = useState("todos")
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      loadUsuarios()
    }
  }, [user])

  const loadUsuarios = async () => {
    try {
      const { data, error } = await supabase.from("perfiles").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error cargando usuarios:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios",
          variant: "destructive",
        })
      } else {
        setUsuarios(data || [])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const cambiarRolUsuario = async (usuarioId: string, nuevoRol: string) => {
    try {
      const { error } = await supabase.from("perfiles").update({ rol: nuevoRol }).eq("id", usuarioId)

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo cambiar el rol del usuario",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Rol actualizado",
          description: `El usuario ahora es ${nuevoRol}`,
        })
        loadUsuarios()
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al cambiar el rol",
        variant: "destructive",
      })
    }
  }

  const usuariosFiltrados = usuarios.filter((usuario) => {
    const coincideBusqueda =
      usuario.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.apellido?.toLowerCase().includes(busqueda.toLowerCase()) ||
      usuario.id.toLowerCase().includes(busqueda.toLowerCase())

    const coincideRol = filtroRol === "todos" || usuario.rol === filtroRol

    return coincideBusqueda && coincideRol
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
      <AdminHeader title="Gestionar Usuarios" description="Administra los usuarios registrados" backUrl="/admin" />

      <div className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filtroRol} onValueChange={setFiltroRol}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los roles</SelectItem>
              <SelectItem value="cliente">Cliente</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Usuarios</p>
                  <p className="text-2xl font-bold">{usuarios.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Clientes</p>
                  <p className="text-2xl font-bold">{usuarios.filter((u) => u.rol === "cliente").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Administradores</p>
                  <p className="text-2xl font-bold">{usuarios.filter((u) => u.rol === "admin").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de usuarios */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usuariosFiltrados.map((usuario) => (
              <Card key={usuario.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {usuario.rol === "admin" ? (
                          <Shield className="h-5 w-5 text-primary" />
                        ) : (
                          <User className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {usuario.nombre || "Sin nombre"} {usuario.apellido || ""}
                        </CardTitle>
                        <Badge variant={usuario.rol === "admin" ? "default" : "secondary"}>
                          {usuario.rol === "admin" ? "Administrador" : "Cliente"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Registrado: {new Date(usuario.created_at).toLocaleDateString("es-CL")}</span>
                    </div>

                    {usuario.telefono && (
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">📞</span>
                        <span>{usuario.telefono}</span>
                      </div>
                    )}

                    {usuario.ciudad && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {usuario.ciudad}, {usuario.region}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Cambiar rol:</p>
                    <Select
                      value={usuario.rol}
                      onValueChange={(nuevoRol) => cambiarRolUsuario(usuario.id, nuevoRol)}
                      disabled={usuario.id === user?.id} // No permitir cambiar el propio rol
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cliente">Cliente</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    {usuario.id === user?.id && (
                      <p className="text-xs text-muted-foreground mt-1">No puedes cambiar tu propio rol</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {usuariosFiltrados.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No se encontraron usuarios</h3>
            <p className="text-muted-foreground">
              {busqueda || filtroRol !== "todos"
                ? "Intenta ajustar los filtros de búsqueda"
                : "No hay usuarios registrados aún"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
