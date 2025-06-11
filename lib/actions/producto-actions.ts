"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { Producto } from "@/lib/types"

export async function getProductos({
  categoria,
  busqueda,
  ordenar,
  pagina = 1,
  porPagina = 12,
  destacados = false,
  nuevos = false,
}: {
  categoria?: string
  busqueda?: string
  ordenar?: string
  pagina?: number
  porPagina?: number
  destacados?: boolean
  nuevos?: boolean
}) {
  const supabase = createServerSupabaseClient()

  let query = supabase.from("productos").select(`
      *,
      categorias (
        id,
        nombre,
        slug
      )
    `)

  // Filtrar por categoría
  if (categoria && categoria !== "todos") {
    query = query.eq("categorias.slug", categoria)
  }

  // Filtrar por búsqueda
  if (busqueda) {
    query = query.ilike("nombre", `%${busqueda}%`)
  }

  // Filtrar por destacados
  if (destacados) {
    query = query.eq("destacado", true)
  }

  // Filtrar por nuevos
  if (nuevos) {
    query = query.eq("nuevo", true)
  }

  // Ordenar
  if (ordenar) {
    switch (ordenar) {
      case "precio-asc":
        query = query.order("precio", { ascending: true })
        break
      case "precio-desc":
        query = query.order("precio", { ascending: false })
        break
      case "nombre-asc":
        query = query.order("nombre", { ascending: true })
        break
      case "nombre-desc":
        query = query.order("nombre", { ascending: false })
        break
      case "recientes":
        query = query.order("created_at", { ascending: false })
        break
      default:
        query = query.order("created_at", { ascending: false })
    }
  } else {
    query = query.order("created_at", { ascending: false })
  }

  // Paginación
  const desde = (pagina - 1) * porPagina
  const hasta = desde + porPagina - 1

  query = query.range(desde, hasta)

  const { data, error, count } = await query

  if (error) {
    console.error("Error al obtener productos:", error)
    return { productos: [], total: 0, error: error.message }
  }

  // Obtener ratings de productos
  const { data: ratings } = await supabase
    .from("productos_rating")
    .select("id, rating")
    .in(
      "id",
      data.map((p) => p.id),
    )

  // Combinar productos con ratings
  const productosConRating = data.map((producto) => {
    const rating = ratings?.find((r) => r.id === producto.id)
    return {
      ...producto,
      rating: rating?.rating || 0,
    }
  })

  return {
    productos: productosConRating as Producto[],
    total: count || 0,
    error: null,
  }
}

export async function getProductoById(id: number) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("productos")
    .select(`
      *,
      categorias (
        id,
        nombre,
        slug
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error al obtener producto:", error)
    return { producto: null, error: error.message }
  }

  // Obtener rating del producto
  const { data: rating } = await supabase.from("productos_rating").select("rating, total_resenas").eq("id", id).single()

  // Obtener reseñas del producto
  const { data: resenas } = await supabase
    .from("resenas")
    .select(`
      *,
      perfiles (
        nombre,
        apellido
      )
    `)
    .eq("producto_id", id)
    .order("fecha", { ascending: false })

  return {
    producto: {
      ...data,
      rating: rating?.rating || 0,
      total_resenas: rating?.total_resenas || 0,
      resenas: resenas || [],
    } as Producto & { resenas: any[] },
    error: null,
  }
}

export async function getCategorias() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("categorias").select("*").order("nombre")

  if (error) {
    console.error("Error al obtener categorías:", error)
    return { categorias: [], error: error.message }
  }

  return { categorias: data, error: null }
}
