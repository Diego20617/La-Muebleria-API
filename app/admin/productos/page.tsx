"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Search, Eye, Copy } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminHeader } from "@/components/admin-header"
import { useAuth } from "@/components/auth-provider"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function AdminProductosPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [productos, setProductos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState("")
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      loadProductos()
    }
  }, [user])

  const loadProductos = async () => {
    try {
      const { data, error } = await supabase
        .from("productos")
        .select(`
          *,
          categorias (nombre, slug)
        `)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error cargando productos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive",
        })
      } else {
        setProductos(data || [])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const eliminarProducto = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return
    }

    try {
      const { error } = await supabase.from("productos").delete().eq("id", id)

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar el producto",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Producto eliminado",
          description: "El producto ha sido eliminado exitosamente",
        })
        loadProductos()
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el producto",
        variant: "destructive",
      })
    }
  }

  const duplicarProducto = async (id: number) => {
    try {
      const { data: producto, error: fetchError } = await supabase.from("productos").select("*").eq("id", id).single()

      if (fetchError || !producto) {
        toast({
          title: "Error",
          description: "No se pudo encontrar el producto",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("productos").insert({
        nombre: `${producto.nombre} (Copia)`,
        descripcion: producto.descripcion,
        precio: producto.precio,
        precio_anterior: producto.precio_anterior,
        descuento: producto.descuento,
        stock: 0,
        categoria_id: producto.categoria_id,
        imagen_url: producto.imagen_url,
        destacado: false,
        nuevo: false,
      })

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo duplicar el producto",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Producto duplicado",
          description: "El producto ha sido duplicado exitosamente",
        })
        loadProductos()
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al duplicar el producto",
        variant: "destructive",
      })
    }
  }

  const cambiarEstado = async (id: number, campo: string, valor: boolean) => {
    try {
      const updateData: any = {}
      updateData[campo] = valor

      const { error } = await supabase.from("productos").update(updateData).eq("id", id)

      if (error) {
        toast({
          title: "Error",
          description: `No se pudo cambiar el estado del producto`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Estado actualizado",
          description: `El producto ha sido ${valor ? "activado" : "desactivado"} exitosamente`,
        })
        loadProductos()
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al cambiar el estado",
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

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  )

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
      <AdminHeader title="Gestionar Productos" description="Administra el catálogo de productos" backUrl="/admin">
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Link>
        </Button>
      </AdminHeader>

      <div className="container mx-auto px-4 py-8">
        {/* Búsqueda */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de productos */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productosFiltrados.map((producto) => (
              <Card key={producto.id}>
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={producto.imagen_url || "/placeholder.svg"}
                      alt={producto.nombre}
                      width={400}
                      height={200}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {producto.nuevo && <Badge className="bg-green-500">Nuevo</Badge>}
                      {producto.destacado && <Badge className="bg-blue-500">Destacado</Badge>}
                      {producto.descuento && <Badge className="bg-red-500">-{producto.descuento}%</Badge>}
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{producto.nombre}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{producto.categorias?.nombre}</p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-bold text-primary">{formatearPrecio(producto.precio)}</span>
                      {producto.precio_anterior && (
                        <span className="text-sm text-muted-foreground line-through">
                          {formatearPrecio(producto.precio_anterior)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">Stock: {producto.stock} unidades</p>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/productos/${producto.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild className="flex-1">
                        <Link href={`/admin/productos/${producto.id}/editar`}>
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => duplicarProducto(producto.id)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarProducto(producto.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Switches para destacado y nuevo */}
                    <div className="flex gap-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={producto.destacado}
                          onCheckedChange={(checked) => cambiarEstado(producto.id, "destacado", checked)}
                        />
                        <Label className="text-xs">Destacado</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={producto.nuevo}
                          onCheckedChange={(checked) => cambiarEstado(producto.id, "nuevo", checked)}
                        />
                        <Label className="text-xs">Nuevo</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {productosFiltrados.length === 0 && !loading && (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No se encontraron productos</h3>
            <p className="text-muted-foreground mb-4">
              {busqueda ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer producto"}
            </p>
            <Button asChild>
              <Link href="/admin/productos/nuevo">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Producto
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
