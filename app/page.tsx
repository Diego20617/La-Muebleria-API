"use client"

import { useState, useEffect } from "react"
import { ShoppingCart, Search, Heart, Star, Plus, Package } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/components/auth-provider"
import { getProductos, getCategorias } from "@/lib/actions/producto-actions"
import type { Producto } from "@/lib/types"
import { AddToCartButton } from "@/components/add-to-cart-button"

interface Categoria {
  id: number
  nombre: string
  slug: string
}

export default function HomePage() {
  const { user } = useAuth()
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("todos")
  const [carritoCount, setCarritoCount] = useState(0)
  const [busqueda, setBusqueda] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar productos y categorías reales de la base de datos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        setError(null)

        // Cargar productos reales
        const resultadoProductos = await getProductos({
          destacados: true,
          pagina: 1,
          porPagina: 12,
        })

        if (resultadoProductos.error) {
          setError(resultadoProductos.error)
        } else {
          setProductos(resultadoProductos.productos)
        }

        // Cargar categorías reales
        const resultadoCategorias = await getCategorias()
        if (resultadoCategorias.error) {
          console.error("Error cargando categorías:", resultadoCategorias.error)
        } else {
          setCategorias(resultadoCategorias.categorias)
        }
      } catch (err) {
        console.error("Error cargando datos:", err)
        setError("Error al cargar los datos")
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(precio)
  }

  const handleAgregarAlCarrito = async (productoId: number) => {
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito")
      return
    }
    setCarritoCount((prev) => prev + 1)
    alert("Producto agregado al carrito")
  }

  const productosFiltrados = productos.filter((producto) => {
    const coincideCategoria = categoriaSeleccionada === "todos" || producto.categorias?.slug === categoriaSeleccionada
    const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    return coincideCategoria && coincideBusqueda
  })

  // Componente de skeleton para carga
  const ProductoSkeleton = () => (
    <Card className="group">
      <CardContent className="p-0">
        <Skeleton className="w-full h-64 rounded-t-lg" />
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  )

  // Componente de estado vacío
  const EstadoVacio = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <Package className="h-24 w-24 text-muted-foreground mb-6" />
      <h3 className="text-2xl font-semibold mb-2">No hay productos disponibles</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Aún no se han agregado productos a la tienda. Los productos aparecerán aquí una vez que sean creados desde el
        panel de administración.
      </p>
      {user?.email === "admin@muebleriasanbernardo.cl" && (
        <Button asChild>
          <Link href="/admin/productos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Primer Producto
          </Link>
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">🪑</span>
            </div>
            <span className="font-bold text-xl">San Bernardo</span>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link href="/productos" className="text-sm font-medium hover:text-primary transition-colors">
              Productos
            </Link>
            <Link href="/ofertas" className="text-sm font-medium hover:text-primary transition-colors">
              Ofertas
            </Link>
            <Link href="/contacto" className="text-sm font-medium hover:text-primary transition-colors">
              Contacto
            </Link>
          </nav>

          {/* Acciones */}
          <div className="flex items-center space-x-2">
            {/* Búsqueda */}
            <div className="hidden sm:flex relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar muebles..."
                className="pl-8 w-64"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            {/* Usuario */}
            <UserMenu />

            {/* Carrito */}
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/carrito">
                <ShoppingCart className="h-5 w-5" />
                {carritoCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {carritoCount}
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Transforma tu hogar con
              <span className="text-primary"> muebles únicos</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Descubre nuestra colección de muebles de alta calidad, diseñados para crear espacios únicos y funcionales.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg px-8">
                Ver Catálogo
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8">
                Ofertas Especiales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Filtros - Solo mostrar si hay categorías */}
      {!loading && categorias.length > 0 && (
        <section className="py-8 border-b">
          <div className="container px-4">
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={categoriaSeleccionada === "todos" ? "default" : "outline"}
                onClick={() => setCategoriaSeleccionada("todos")}
                className="rounded-full"
              >
                Todos
              </Button>
              {categorias.map((categoria) => (
                <Button
                  key={categoria.slug}
                  variant={categoriaSeleccionada === categoria.slug ? "default" : "outline"}
                  onClick={() => setCategoriaSeleccionada(categoria.slug)}
                  className="rounded-full"
                >
                  {categoria.nombre}
                </Button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Productos */}
      <section className="py-12">
        <div className="container px-4">
          {/* Mostrar error si existe */}
          {error && (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">Error: {error}</p>
              <Button onClick={() => window.location.reload()}>Reintentar</Button>
            </div>
          )}

          {/* Mostrar contenido solo si no hay error */}
          {!error && (
            <>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">
                  {categoriaSeleccionada === "todos" ? "Productos Destacados" : categoriaSeleccionada}
                </h2>
                {!loading && <p className="text-muted-foreground">{productosFiltrados.length} productos</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Mostrar skeletons mientras carga */}
                {loading && (
                  <>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ProductoSkeleton key={i} />
                    ))}
                  </>
                )}

                {/* Mostrar productos reales */}
                {!loading &&
                  productosFiltrados.length > 0 &&
                  productosFiltrados.map((producto) => (
                    <Card key={producto.id} className="group hover:shadow-lg transition-shadow">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Image
                            src={producto.imagen_url || "/placeholder.svg?height=300&width=400"}
                            alt={producto.nombre}
                            width={400}
                            height={300}
                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-4 left-4 flex gap-2">
                            {producto.nuevo && <Badge className="bg-green-500">Nuevo</Badge>}
                            {producto.descuento && <Badge className="bg-red-500">-{producto.descuento}%</Badge>}
                            {producto.destacado && <Badge className="bg-blue-500">Destacado</Badge>}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-4 right-4 bg-white/80 hover:bg-white"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="p-4">
                          <div className="flex items-center gap-1 mb-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < (producto.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-muted-foreground">({producto.rating || 0})</span>
                          </div>

                          <h3 className="font-semibold text-lg mb-2">{producto.nombre}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{producto.categorias?.nombre}</p>

                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-primary">{formatearPrecio(producto.precio)}</span>
                            {producto.precio_anterior && (
                              <span className="text-sm text-muted-foreground line-through">
                                {formatearPrecio(producto.precio_anterior)}
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground">Stock: {producto.stock} unidades</p>
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <div className="flex-1">
                          <AddToCartButton
                            producto={{
                              id: Number(producto.id),
                              nombre: producto.nombre,
                              precio: producto.precio,
                              imagen_url: producto.imagen_url,
                              stock: producto.stock
                            }}
                          />
                        </div>
                        <Button variant="outline" size="icon" asChild>
                          <Link href={`/productos/${producto.id}`}>
                            <Search className="h-4 w-4" />
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}

                {/* Mostrar estado vacío si no hay productos */}
                {!loading && productosFiltrados.length === 0 && !error && <EstadoVacio />}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12 mt-20">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-lg">🪑</span>
                </div>
                <span className="font-bold text-xl">San Bernardo</span>
              </div>
              <p className="text-muted-foreground">Tu tienda de confianza para muebles de calidad y diseño único.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Productos</h4>
              <ul className="space-y-2 text-muted-foreground">
                {categorias.map((categoria) => (
                  <li key={categoria.slug}>
                    <Link href={`/?categoria=${categoria.slug}`} className="hover:text-primary">
                      {categoria.nombre}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Ayuda</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/contacto" className="hover:text-primary">
                    Contacto
                  </Link>
                </li>
                <li>
                  <Link href="/envios" className="hover:text-primary">
                    Envíos
                  </Link>
                </li>
                <li>
                  <Link href="/devoluciones" className="hover:text-primary">
                    Devoluciones
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-primary">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>📍 San Bernardo, Chile</li>
                <li>📞 +56 9 1234 5678</li>
                <li>✉️ info@muebleriasanbernardo.cl</li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Mueblería San Bernardo. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
