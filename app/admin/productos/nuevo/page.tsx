"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Save, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/image-upload"
import { useAuth } from "@/components/auth-provider"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function NuevoProductoPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [categorias, setCategorias] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    precio_anterior: "",
    stock: "",
    categoria_id: "",
    imagen_url: "",
    destacado: false,
    nuevo: false,
  })
  const supabase = getSupabaseClient()

  useEffect(() => {
    loadCategorias()
  }, [])

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

  const handleImageSelect = (imageUrl: string) => {
    setFormData({ ...formData, imagen_url: imageUrl })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const precio = Number.parseInt(formData.precio)
      const precio_anterior = formData.precio_anterior ? Number.parseInt(formData.precio_anterior) : null
      const stock = Number.parseInt(formData.stock)
      const categoria_id = Number.parseInt(formData.categoria_id)

      // Calcular descuento automáticamente
      let descuento = null
      if (precio_anterior && precio_anterior > precio) {
        descuento = Math.round(((precio_anterior - precio) / precio_anterior) * 100)
      }

      const { data, error } = await supabase
        .from("productos")
        .insert({
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
        })
        .select()

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo crear el producto: " + error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "¡Producto creado!",
          description: "El producto ha sido creado exitosamente",
        })
        router.push("/admin/productos")
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el producto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!user || user.email !== "admin@muebleriasanbernardo.cl") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <h2 className="text-xl font-bold mb-4">Acceso Denegado</h2>
            <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Nuevo Producto</h1>
              <p className="text-muted-foreground">Agrega un nuevo producto al catálogo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Información del Producto</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nombre */}
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

              {/* Descripción */}
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

              {/* Imagen */}
              <div className="space-y-2">
                <Label>Imagen del Producto</Label>
                <ImageUpload onImageSelect={handleImageSelect} currentImage={formData.imagen_url} />
              </div>

              {/* Precios */}
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

              {/* Stock y Categoría */}
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

              {/* Switches */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
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

                <div className="flex items-center justify-between p-4 border rounded-lg">
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

              {/* Botones */}
              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Guardar Producto
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
  )
}
