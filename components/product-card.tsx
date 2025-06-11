"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface ProductCardProps {
  producto: {
    id: number
    nombre: string
    precio: number
    precio_anterior?: number
    imagen_url: string
    stock: number
    nuevo?: boolean
    destacado?: boolean
    descuento?: number
    categoria?: string
  }
}

export function ProductCard({ producto }: ProductCardProps) {
  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio)
  }

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <Link href={`/productos/${producto.id}`}>
          <div className="aspect-square overflow-hidden">
            <Image
              src={producto.imagen_url || "/placeholder.svg?height=300&width=300"}
              alt={producto.nombre}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {producto.nuevo && <Badge className="bg-green-500">Nuevo</Badge>}
          {producto.destacado && <Badge className="bg-blue-500">Destacado</Badge>}
          {producto.descuento && <Badge className="bg-red-500">-{producto.descuento}%</Badge>}
        </div>

        {/* Botón de favoritos */}
        <Button variant="ghost" size="icon" className="absolute top-2 right-2 bg-white/80 hover:bg-white">
          <Heart className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <Link href={`/productos/${producto.id}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
              {producto.nombre}
            </h3>
          </Link>
          {producto.categoria && <p className="text-sm text-muted-foreground">{producto.categoria}</p>}
        </div>

        {/* Rating placeholder */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-4 w-4 text-gray-300" />
          ))}
          <span className="text-sm text-muted-foreground ml-1">(0)</span>
        </div>

        {/* Precio */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">{formatearPrecio(producto.precio)}</span>
            {producto.precio_anterior && (
              <span className="text-sm text-muted-foreground line-through">
                {formatearPrecio(producto.precio_anterior)}
              </span>
            )}
          </div>
          {producto.descuento && (
            <p className="text-sm text-green-600">
              Ahorras {formatearPrecio(producto.precio_anterior! - producto.precio)}
            </p>
          )}
        </div>

        {/* Stock */}
        <div className="flex items-center gap-2">
          <span className="text-xs">Stock:</span>
          <Badge
            variant={producto.stock > 10 ? "default" : producto.stock > 0 ? "secondary" : "destructive"}
            className="text-xs"
          >
            {producto.stock > 0 ? `${producto.stock} unidades` : "Sin stock"}
          </Badge>
        </div>

        {/* Botón de agregar al carrito */}
        <AddToCartButton
          producto={{
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen_url: producto.imagen_url,
            stock: producto.stock
          }}
          className="w-full"
        />
      </CardContent>
    </Card>
  )
}
