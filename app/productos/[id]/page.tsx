"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Star, Heart, Share2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-provider"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { AddToCartButton } from "@/components/add-to-cart-button"

export default function ProductoPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [producto, setProducto] = useState<any>(null)
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0)
  const [resenas, setResenas] = useState<any[]>([])
  const [nuevaResena, setNuevaResena] = useState({ calificacion: 5, comentario: "" })
  const [loading, setLoading] = useState(true)
  const [esFavorito, setEsFavorito] = useState(false)
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (params.id) {
      loadProducto()
      loadResenas()
      if (user) {
        checkFavorito()
      }
    }
  }, [params.id, user])

  const loadProducto = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("productos")
        .select(`
          *,
          categorias (*)
        `)
        .eq("id", params.id)
        .single()

      if (error) {
        console.error("Error cargando producto:", error)
        toast({
          title: "Error",
          description: "No se pudo cargar el producto",
          variant: "destructive",
        })
      } else {
        setProducto(data)
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar el producto",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadResenas = async () => {
    try {
      const { data } = await supabase
        .from("resenas")
        .select(`
          *,
          perfiles (nombre, apellido)
        `)
        .eq("producto_id", params.id)
        .order("fecha", { ascending: false })

      setResenas(data || [])
    } catch (error) {
      console.error("Error cargando reseñas:", error)
    }
  }

  const checkFavorito = async () => {
    if (!user) return

    try {
      const { data } = await supabase
        .from("favoritos")
        .select("id")
        .eq("usuario_id", user.id)
        .eq("producto_id", params.id)
        .single()

      setEsFavorito(!!data)
    } catch (error) {
      // No es favorito
    }
  }

  const handleToggleFavorito = async () => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para agregar favoritos",
        variant: "destructive",
      })
      return
    }

    try {
      if (esFavorito) {
        await supabase.from("favoritos").delete().eq("usuario_id", user.id).eq("producto_id", params.id)
        setEsFavorito(false)
        toast({ title: "Eliminado de favoritos" })
      } else {
        await supabase.from("favoritos").insert({ usuario_id: user.id, producto_id: params.id })
        setEsFavorito(true)
        toast({ title: "Agregado a favoritos" })
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "No se pudo actualizar favoritos",
        variant: "destructive",
      })
    }
  }

  const handleSubmitResena = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para escribir una reseña",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.from("resenas").insert({
        producto_id: params.id,
        usuario_id: user.id,
        calificacion: nuevaResena.calificacion,
        comentario: nuevaResena.comentario,
      })

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo enviar la reseña",
          variant: "destructive",
        })
      } else {
        toast({ title: "Reseña enviada exitosamente" })
        setNuevaResena({ calificacion: 5, comentario: "" })
        loadResenas()
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al enviar la reseña",
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

  const calcularRatingPromedio = () => {
    if (resenas.length === 0) return 0
    const suma = resenas.reduce((acc, resena) => acc + resena.calificacion, 0)
    return suma / resenas.length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!producto) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Producto no encontrado</h2>
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  const imagenes = [producto.imagen_url, ...(producto.imagenes_adicionales || [])]
  const ratingPromedio = calcularRatingPromedio()

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">
            Inicio
          </Link>
          <span>/</span>
          <Link href={`/?categoria=${producto.categorias?.slug}`} className="hover:text-primary">
            {producto.categorias?.nombre}
          </Link>
          <span>/</span>
          <span className="text-foreground">{producto.nombre}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Imágenes */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <Image
                src={imagenes[imagenSeleccionada] || "/placeholder.svg"}
                alt={producto.nombre}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            {imagenes.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {imagenes.map((imagen, index) => (
                  <button
                    key={index}
                    onClick={() => setImagenSeleccionada(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                      imagenSeleccionada === index ? "border-primary" : "border-border"
                    }`}
                  >
                    <Image
                      src={imagen || "/placeholder.svg"}
                      alt={`${producto.nombre} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {producto.nuevo && <Badge className="bg-green-500">Nuevo</Badge>}
                {producto.destacado && <Badge className="bg-blue-500">Destacado</Badge>}
                {producto.descuento && <Badge className="bg-red-500">-{producto.descuento}%</Badge>}
              </div>
              <h1 className="text-3xl font-bold mb-2">{producto.nombre}</h1>
              <p className="text-muted-foreground">{producto.categorias?.nombre}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(ratingPromedio) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({ratingPromedio.toFixed(1)}) - {resenas.length} reseñas
              </span>
            </div>

            {/* Precio */}
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-4xl font-bold text-primary">{formatearPrecio(producto.precio)}</span>
                {producto.precio_anterior && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatearPrecio(producto.precio_anterior)}
                  </span>
                )}
              </div>
              {producto.descuento && (
                <p className="text-green-600 font-medium">
                  Ahorras {formatearPrecio(producto.precio_anterior - producto.precio)} ({producto.descuento}% de
                  descuento)
                </p>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Stock disponible:</span>
              <Badge variant={producto.stock > 10 ? "default" : producto.stock > 0 ? "secondary" : "destructive"}>
                {producto.stock > 0 ? `${producto.stock} unidades` : "Sin stock"}
              </Badge>
            </div>

            {/* Botón de agregar al carrito */}
            <div className="space-y-4">
              <AddToCartButton
                producto={{
                  id: Number(producto.id),
                  nombre: producto.nombre,
                  precio: producto.precio,
                  imagen_url: producto.imagen_url,
                  stock: producto.stock
                }}
                className="w-full"
              />

              <div className="flex gap-4">
                <Button variant="outline" size="lg" onClick={handleToggleFavorito} className="flex-1">
                  <Heart className={`h-5 w-5 mr-2 ${esFavorito ? "fill-red-500 text-red-500" : ""}`} />
                  {esFavorito ? "En Favoritos" : "Agregar a Favoritos"}
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs con información adicional */}
        <div className="mt-16">
          <Tabs defaultValue="descripcion" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="descripcion">Descripción</TabsTrigger>
              <TabsTrigger value="especificaciones">Especificaciones</TabsTrigger>
              <TabsTrigger value="resenas">Reseñas ({resenas.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="descripcion" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    {producto.descripcion || "No hay descripción disponible para este producto."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="especificaciones" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Información General</h4>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <span className="font-medium">Categoría:</span> {producto.categorias?.nombre}
                        </li>
                        <li>
                          <span className="font-medium">Stock:</span> {producto.stock} unidades
                        </li>
                        <li>
                          <span className="font-medium">Estado:</span> {producto.nuevo ? "Nuevo" : "Disponible"}
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Detalles del Producto</h4>
                      <ul className="space-y-2 text-sm">
                        <li>
                          <span className="font-medium">Material:</span> Información no disponible
                        </li>
                        <li>
                          <span className="font-medium">Dimensiones:</span> Información no disponible
                        </li>
                        <li>
                          <span className="font-medium">Peso:</span> Información no disponible
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resenas" className="mt-6">
              <div className="space-y-6">
                {/* Formulario para nueva reseña */}
                {user && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Escribir una reseña</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSubmitResena} className="space-y-4">
                        <div>
                          <Label htmlFor="calificacion">Calificación</Label>
                          <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                onClick={() => setNuevaResena({ ...nuevaResena, calificacion: star })}
                                className="p-1"
                              >
                                <Star
                                  className={`h-6 w-6 ${
                                    star <= nuevaResena.calificacion
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="comentario">Comentario</Label>
                          <Textarea
                            id="comentario"
                            value={nuevaResena.comentario}
                            onChange={(e) => setNuevaResena({ ...nuevaResena, comentario: e.target.value })}
                            placeholder="Comparte tu experiencia con este producto..."
                            className="mt-2"
                          />
                        </div>
                        <Button type="submit">Enviar Reseña</Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                {/* Lista de reseñas */}
                <div className="space-y-4">
                  {resenas.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">No hay reseñas para este producto aún.</p>
                      </CardContent>
                    </Card>
                  ) : (
                    resenas.map((resena) => (
                      <Card key={resena.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold">
                                  {resena.perfiles?.nombre} {resena.perfiles?.apellido}
                                </span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < resena.calificacion ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {new Date(resena.fecha).toLocaleDateString("es-CL")}
                              </p>
                            </div>
                          </div>
                          <p className="text-muted-foreground">{resena.comentario}</p>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
