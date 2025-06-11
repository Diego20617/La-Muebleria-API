"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Star, Search, Filter, ArrowLeft, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useAuth } from "@/components/auth-provider"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Resena {
  id: number
  calificacion: number
  comentario: string
  fecha: string
  producto_id: number
  productos: {
    id: number
    nombre: string
    imagen_url: string
    precio: number
  }
}

export default function MisResenasPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [resenas, setResenas] = useState<Resena[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRating, setFilterRating] = useState<string>("all")
  const supabase = getSupabaseClient()

  useEffect(() => {
    if (user) {
      loadMisResenas()
    }
  }, [user])

  const loadMisResenas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("resenas")
        .select(`
          *,
          productos (
            id,
            nombre,
            imagen_url,
            precio
          )
        `)
        .eq("usuario_id", user?.id)
        .order("fecha", { ascending: false })

      if (error) {
        console.error("Error cargando reseñas:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar las reseñas",
          variant: "destructive",
        })
      } else {
        setResenas(data || [])
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al cargar las reseñas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const eliminarResena = async (resenaId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta reseña?")) {
      return
    }

    try {
      const { error } = await supabase.from("resenas").delete().eq("id", resenaId).eq("usuario_id", user?.id)

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo eliminar la reseña",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Reseña eliminada",
          description: "La reseña ha sido eliminada exitosamente",
        })
        loadMisResenas()
      }
    } catch (error) {
      console.error("Error:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al eliminar la reseña",
        variant: "destructive",
      })
    }
  }

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio)
  }

  // Filtrar reseñas
  const resenasFiltradas = resenas.filter((resena) => {
    const matchesSearch =
      resena.productos.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resena.comentario.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = filterRating === "all" || resena.calificacion.toString() === filterRating
    return matchesSearch && matchesRating
  })

  const promedioCalificacion =
    resenas.length > 0 ? resenas.reduce((sum, resena) => sum + resena.calificacion, 0) / resenas.length : 0

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Acceso Denegado</h2>
          <p>Debes iniciar sesión para ver tus reseñas.</p>
          <Button asChild className="mt-4">
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
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Star className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Mis Reseñas</h1>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{resenas.length}</div>
              <div className="text-sm text-muted-foreground">Total de Reseñas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-1">
                <div className="text-2xl font-bold text-primary">{promedioCalificacion.toFixed(1)}</div>
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="text-sm text-muted-foreground">Promedio de Calificación</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{resenas.filter((r) => r.calificacion >= 4).length}</div>
              <div className="text-sm text-muted-foreground">Reseñas Positivas (4-5★)</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar en mis reseñas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filtrar por calificación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las calificaciones</SelectItem>
                    <SelectItem value="5">5 estrellas</SelectItem>
                    <SelectItem value="4">4 estrellas</SelectItem>
                    <SelectItem value="3">3 estrellas</SelectItem>
                    <SelectItem value="2">2 estrellas</SelectItem>
                    <SelectItem value="1">1 estrella</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de reseñas */}
        {resenasFiltradas.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Star className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-4">
                {resenas.length === 0 ? "No has escrito reseñas aún" : "No se encontraron reseñas"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {resenas.length === 0
                  ? "Compra algunos productos y comparte tu experiencia"
                  : "Intenta con otros términos de búsqueda"}
              </p>
              {resenas.length === 0 && (
                <Button asChild>
                  <Link href="/">Ver Productos</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {resenasFiltradas.map((resena) => (
              <Card key={resena.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={resena.productos.imagen_url || "/placeholder.svg"}
                        alt={resena.productos.nombre}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link
                            href={`/productos/${resena.producto_id}`}
                            className="font-semibold text-lg hover:text-primary transition-colors"
                          >
                            {resena.productos.nombre}
                          </Link>
                          <p className="text-sm text-muted-foreground">{formatearPrecio(resena.productos.precio)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {resena.calificacion}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => eliminarResena(resena.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < resena.calificacion ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">{formatearFecha(resena.fecha)}</span>
                      </div>

                      <p className="text-muted-foreground">{resena.comentario}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
