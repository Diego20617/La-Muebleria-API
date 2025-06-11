"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function FavoritosPage() {
  const { user } = useAuth()
  const [favoritos, setFavoritos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    loadFavoritos()
  }, [user])

  const loadFavoritos = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("favoritos")
        .select(`
          *,
          productos (*)
        `)
        .eq("usuario_id", user.id)

      if (error) {
        console.error("Error cargando favoritos:", error)
      } else {
        setFavoritos(data || [])
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const eliminarFavorito = async (productoId: number) => {
    try {
      const { error } = await supabase
        .from("favoritos")
        .delete()
        .eq("usuario_id", user?.id)
        .eq("producto_id", productoId)

      if (!error) {
        setFavoritos(favoritos.filter((fav) => fav.producto_id !== productoId))
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Favoritos</h2>
          <p className="mb-4">Debes iniciar sesión para ver tus favoritos.</p>
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
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Mis Favoritos</h1>

        {favoritos.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-4">No tienes favoritos aún</h2>
              <p className="text-muted-foreground mb-6">Agrega productos a favoritos para verlos aquí</p>
              <Button asChild>
                <Link href="/">Explorar Productos</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoritos.map((favorito) => (
              <Card key={favorito.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={favorito.productos.imagen_url || "/placeholder.svg"}
                      alt={favorito.productos.nombre}
                      width={400}
                      height={300}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                      onClick={() => eliminarFavorito(favorito.producto_id)}
                    >
                      <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{favorito.productos.nombre}</h3>
                    <p className="text-2xl font-bold text-primary mb-4">{formatearPrecio(favorito.productos.precio)}</p>

                    <div className="flex gap-2">
                      <Button className="flex-1">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Agregar al Carrito
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/productos/${favorito.producto_id}`}>Ver</Link>
                      </Button>
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
