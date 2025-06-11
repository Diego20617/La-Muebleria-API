"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Save, Trash2 } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminHeader } from "@/components/admin-header"
import { useAuth } from "@/components/auth-provider"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ImageUpload } from "@/components/image-upload"

export default function EditarProductoPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precio_anterior: "",
    descuento: "",
    stock: "",
    categoria_id: "",
    imagen_url: "",
    destacado: false,
    nuevo: false,
  })
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user && productId) {
      loadCategorias()
      loadProducto()
    }
  }, [user, productId])

  const loadCategorias = async () => {
    try {
      const { data, error } = await supabase.from("categorias").select("*").order("nombre")

      if (error) {
        console.error("Error cargando categorías:", error)
      } else {
        setCategorias(data || [])
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const loadProducto = async () => {
    try {
      const { data, error } = await supabase.from("productos").select("*").eq("id", productId).single()

      if (error) {
        console.error("Error cargando producto:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar el producto",
          variant: "destructive",
        })
        router.push("/admin/productos")
      } else {
        setFormData({
          nombre: data.nombre || "",
          descripcion: data.descripcion || "",
          precio: data.precio?.toString() || "",
          precio_anterior: data.precio_anterior?.toString() || "",
          descuento: data.descuento?.toString() || "",
          stock: data.stock?.toString() || "",
          categoria_id: data.categoria_id?.toString() || "",
          imagen_url: data.imagen_url || "",
          destacado: data.destacado || false,
          nuevo: data.nuevo || false,
        })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar el producto",
        variant: "destructive",
      })
    } finally {
      setLoadingProduct(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const precio = Number.parseInt(formData.precio)
      const precio_anterior = formData.precio_anterior ? Number.parseInt(formData.precio_anterior) : null
      const stock = Number.parseInt(formData.stock)
      const categoria_id = Number.parseInt(formData.categoria_id)

      // Calcular descuento automáticamente si hay precio anterior
      let descuento = null
      if (precio_anterior && precio_anterior > precio) {
        descuento = Math.round(((precio_anterior - precio) / precio_anterior) * 100)
      }

      const { error } = await supabase
        .from("productos")
        .update({
          nombre: formData.nombre,
          descripcion: formData.descripcion,
          precio,
          precio_anterior,
          descuento,
          stock,
          categoria_id,
          imagen_url: formData.imagen_url || "/placeholder.svg",
          destacado: formData.destacado,
          nuevo: formData.nuevo,
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId)

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo actualizar el producto",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Producto actualizado",
          description: "El producto ha sido actualizado exitosamente",
        })
        router.push("/admin/productos")
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al actualizar el producto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.")) {
      return
    }

    setDeleting(true)

    try {
      const { error } = await supabase.from("productos").delete().eq("id", productId)

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
        router.push("/admin/productos")
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar el producto",
        variant: "destructive",
      })
    } finally {
      setDeleting(false)
    }
  }

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

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-background">
        <AdminHeader
          title="Editar Producto"
          description="Cargando información del producto..."
          backUrl="/admin/productos"
        />
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        title="Editar Producto"
        description="Modifica la información del producto"
        backUrl="/admin/productos"
      >
        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
          {deleting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Eliminando...
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Eliminar
            </>
          )}
        </Button>
      </AdminHeader>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vista previa del producto */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Image
                      src={formData.imagen_url || "/placeholder.svg"}
                      alt={formData.nombre || "Producto"}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 left-2 flex gap-1">
                      {formData.nuevo && (
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Nuevo</span>
                      )}
                      {formData.destacado && (
                        <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Destacado</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{formData.nombre || "Nombre del producto"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {categorias.find((c) => c.id.toString() === formData.categoria_id)?.nombre || "Categoría"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg font-bold text-primary">
                        ${Number.parseInt(formData.precio || "0").toLocaleString("es-CL")}
                      </span>
                      {formData.precio_anterior && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${Number.parseInt(formData.precio_anterior).toLocaleString("es-CL")}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Stock: {formData.stock || "0"} unidades</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulario de edición */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Información del Producto</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del Producto *</Label>
                    <Input
                      id="nombre"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Ej: Sofá Moderno Gris"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={formData.descripcion}
                      onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                      placeholder="Describe las características del producto..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="precio">Precio *</Label>
                      <Input
                        id="precio"
                        type="number"
                        value={formData.precio}
                        onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                        placeholder="899000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="precio_anterior">Precio Anterior</Label>
                      <Input
                        id="precio_anterior"
                        type="number"
                        value={formData.precio_anterior}
                        onChange={(e) => setFormData({ ...formData, precio_anterior: e.target.value })}
                        placeholder="1200000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        placeholder="15"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoría *</Label>
                      <Select
                        value={formData.categoria_id}
                        onValueChange={(value) => setFormData({ ...formData, categoria_id: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((categoria) => (
                            <SelectItem key={categoria.id} value={categoria.id.toString()}>
                              {categoria.nombre}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imagen">Imagen del Producto</Label>
                    <ImageUpload
                      onImageSelect={(imageUrl) => setFormData({ ...formData, imagen_url: imageUrl })}
                      currentImage={formData.imagen_url}
                    />
                    <p className="text-xs text-muted-foreground">
                      Puedes subir una imagen desde tu galería o usar una URL
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="imagen_url_manual">O ingresa URL manualmente</Label>
                    <Input
                      id="imagen_url_manual"
                      value={formData.imagen_url}
                      onChange={(e) => setFormData({ ...formData, imagen_url: e.target.value })}
                      placeholder="/images/productos/mi-producto.jpg"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="destacado">Producto Destacado</Label>
                        <p className="text-xs text-muted-foreground">Aparecerá en la sección de productos destacados</p>
                      </div>
                      <Switch
                        id="destacado"
                        checked={formData.destacado}
                        onCheckedChange={(checked) => setFormData({ ...formData, destacado: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="nuevo">Producto Nuevo</Label>
                        <p className="text-xs text-muted-foreground">Se mostrará con la etiqueta "Nuevo"</p>
                      </div>
                      <Switch
                        id="nuevo"
                        checked={formData.nuevo}
                        onCheckedChange={(checked) => setFormData({ ...formData, nuevo: checked })}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" disabled={loading} className="flex-1">
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Guardar Cambios
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
