"use server"

import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import type { CarritoItem } from "@/lib/types"

// Función para obtener el ID del usuario actual
async function getCurrentUserId() {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Error getting current user:", error)
      return null
    }

    return user?.id || null
  } catch (error) {
    console.error("Error in getCurrentUserId:", error)
    return null
  }
}

// Función para obtener el carrito de un usuario autenticado
export async function getCarritoAutenticado() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { items: [], error: "Usuario no autenticado" }
  }

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("carrito")
    .select(`
      producto_id,
      cantidad,
      productos (*)
    `)
    .eq("usuario_id", userId)

  if (error) {
    console.error("Error al obtener carrito:", error)
    return { items: [], error: error.message }
  }

  const items: CarritoItem[] = data.map((item) => ({
    producto_id: item.producto_id,
    cantidad: item.cantidad,
    producto: item.productos,
  }))

  return { items, error: null }
}

// Función para obtener el carrito de un usuario no autenticado (desde cookies)
export async function getCarritoNoAutenticado() {
  try {
    const carritoStr = cookies().get("carrito")?.value

    if (!carritoStr) {
      return { items: [], error: null }
    }

    let carritoItems: { producto_id: number; cantidad: number }[] = []

    try {
      carritoItems = JSON.parse(carritoStr)

      if (!Array.isArray(carritoItems)) {
        console.error("Carrito cookie is not an array")
        return { items: [], error: null }
      }
    } catch (error) {
      console.error("Error parsing carrito cookie:", error)
      // Reset the invalid cookie
      cookies().set("carrito", "[]", {
        maxAge: 60 * 60 * 24 * 30, // 30 días
        path: "/",
      })
      return { items: [], error: null }
    }

    if (!carritoItems.length) {
      return { items: [], error: null }
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .in(
        "id",
        carritoItems.map((item) => item.producto_id),
      )

    if (error) {
      console.error("Error al obtener productos del carrito:", error)
      return { items: [], error: error.message }
    }

    const items = carritoItems
      .filter((item) => data.some((p) => p.id === item.producto_id)) // Only include items that exist in the database
      .map((item) => {
        const producto = data.find((p) => p.id === item.producto_id)
        return {
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          producto: producto!,
        }
      })

    return { items, error: null }
  } catch (error) {
    console.error("Error in getCarritoNoAutenticado:", error)
    return { items: [], error: "Error al obtener carrito" }
  }
}

// Función para obtener el carrito (autenticado o no)
export async function getCarrito() {
  const userId = await getCurrentUserId()

  if (userId) {
    return getCarritoAutenticado()
  } else {
    return getCarritoNoAutenticado()
  }
}

// Función para agregar un producto al carrito
export async function agregarAlCarrito(productoId: number, cantidad = 1) {
  const userId = await getCurrentUserId()

  if (userId) {
    // Usuario autenticado: guardar en base de datos
    const supabase = createServerSupabaseClient()

    // Verificar si el producto ya está en el carrito
    const { data: existente } = await supabase
      .from("carrito")
      .select("cantidad")
      .eq("usuario_id", userId)
      .eq("producto_id", productoId)
      .single()

    if (existente) {
      // Actualizar cantidad
      const { error } = await supabase
        .from("carrito")
        .update({ cantidad: existente.cantidad + cantidad })
        .eq("usuario_id", userId)
        .eq("producto_id", productoId)

      if (error) {
        console.error("Error al actualizar carrito:", error)
        return { success: false, error: error.message }
      }
    } else {
      // Insertar nuevo item
      const { error } = await supabase.from("carrito").insert({
        usuario_id: userId,
        producto_id: productoId,
        cantidad,
      })

      if (error) {
        console.error("Error al agregar al carrito:", error)
        return { success: false, error: error.message }
      }
    }

    return { success: true, error: null }
  } else {
    // Usuario no autenticado: guardar en cookies
    const carritoStr = cookies().get("carrito")?.value
    let carritoItems: { producto_id: number; cantidad: number }[] = []

    if (carritoStr) {
      try {
        carritoItems = JSON.parse(carritoStr)
      } catch (error) {
        console.error("Error al parsear carrito de cookies:", error)
      }
    }

    // Verificar si el producto ya está en el carrito
    const itemExistente = carritoItems.find((item) => item.producto_id === productoId)

    if (itemExistente) {
      // Actualizar cantidad
      itemExistente.cantidad += cantidad
    } else {
      // Agregar nuevo item
      carritoItems.push({ producto_id: productoId, cantidad })
    }

    // Guardar en cookies
    cookies().set("carrito", JSON.stringify(carritoItems), {
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: "/",
    })

    return { success: true, error: null }
  }
}

// Función para actualizar la cantidad de un producto en el carrito
export async function actualizarCantidadCarrito(productoId: number, cantidad: number) {
  if (cantidad <= 0) {
    return eliminarDelCarrito(productoId)
  }

  const userId = await getCurrentUserId()

  if (userId) {
    // Usuario autenticado: actualizar en base de datos
    const supabase = createServerSupabaseClient()

    const { error } = await supabase
      .from("carrito")
      .update({ cantidad })
      .eq("usuario_id", userId)
      .eq("producto_id", productoId)

    if (error) {
      console.error("Error al actualizar carrito:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } else {
    // Usuario no autenticado: actualizar en cookies
    const carritoStr = cookies().get("carrito")?.value

    if (!carritoStr) {
      return { success: false, error: "Carrito no encontrado" }
    }

    try {
      const carritoItems: { producto_id: number; cantidad: number }[] = JSON.parse(carritoStr)

      const itemIndex = carritoItems.findIndex((item) => item.producto_id === productoId)

      if (itemIndex === -1) {
        return { success: false, error: "Producto no encontrado en el carrito" }
      }

      carritoItems[itemIndex].cantidad = cantidad

      // Guardar en cookies
      cookies().set("carrito", JSON.stringify(carritoItems), {
        maxAge: 60 * 60 * 24 * 30, // 30 días
        path: "/",
      })

      return { success: true, error: null }
    } catch (error) {
      console.error("Error al actualizar carrito en cookies:", error)
      return { success: false, error: "Error al actualizar carrito" }
    }
  }
}

// Función para eliminar un producto del carrito
export async function eliminarDelCarrito(productoId: number) {
  const userId = await getCurrentUserId()

  if (userId) {
    // Usuario autenticado: eliminar de base de datos
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("carrito").delete().eq("usuario_id", userId).eq("producto_id", productoId)

    if (error) {
      console.error("Error al eliminar del carrito:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } else {
    // Usuario no autenticado: eliminar de cookies
    const carritoStr = cookies().get("carrito")?.value

    if (!carritoStr) {
      return { success: false, error: "Carrito no encontrado" }
    }

    try {
      let carritoItems: { producto_id: number; cantidad: number }[] = JSON.parse(carritoStr)

      carritoItems = carritoItems.filter((item) => item.producto_id !== productoId)

      // Guardar en cookies
      cookies().set("carrito", JSON.stringify(carritoItems), {
        maxAge: 60 * 60 * 24 * 30, // 30 días
        path: "/",
      })

      return { success: true, error: null }
    } catch (error) {
      console.error("Error al eliminar del carrito en cookies:", error)
      return { success: false, error: "Error al eliminar del carrito" }
    }
  }
}

// Función para vaciar el carrito
export async function vaciarCarrito() {
  const userId = await getCurrentUserId()

  if (userId) {
    // Usuario autenticado: vaciar en base de datos
    const supabase = createServerSupabaseClient()

    const { error } = await supabase.from("carrito").delete().eq("usuario_id", userId)

    if (error) {
      console.error("Error al vaciar carrito:", error)
      return { success: false, error: error.message }
    }

    return { success: true, error: null }
  } else {
    // Usuario no autenticado: vaciar cookies
    cookies().set("carrito", JSON.stringify([]), {
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: "/",
    })

    return { success: true, error: null }
  }
}

// Función para sincronizar el carrito de cookies a la base de datos (al iniciar sesión)
export async function sincronizarCarrito() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  const carritoStr = cookies().get("carrito")?.value

  if (!carritoStr) {
    return { success: true, error: null }
  }

  try {
    const carritoItems: { producto_id: number; cantidad: number }[] = JSON.parse(carritoStr)

    if (!carritoItems.length) {
      return { success: true, error: null }
    }

    const supabase = createServerSupabaseClient()

    // Obtener carrito actual del usuario
    const { data: carritoActual } = await supabase
      .from("carrito")
      .select("producto_id, cantidad")
      .eq("usuario_id", userId)

    // Procesar cada item de las cookies
    for (const item of carritoItems) {
      const itemExistente = carritoActual?.find((i) => i.producto_id === item.producto_id)

      if (itemExistente) {
        // Actualizar cantidad
        await supabase
          .from("carrito")
          .update({ cantidad: itemExistente.cantidad + item.cantidad })
          .eq("usuario_id", userId)
          .eq("producto_id", item.producto_id)
      } else {
        // Insertar nuevo item
        await supabase.from("carrito").insert({
          usuario_id: userId,
          producto_id: item.producto_id,
          cantidad: item.cantidad,
        })
      }
    }

    // Limpiar cookies
    cookies().set("carrito", JSON.stringify([]), {
      maxAge: 60 * 60 * 24 * 30, // 30 días
      path: "/",
    })

    return { success: true, error: null }
  } catch (error) {
    console.error("Error al sincronizar carrito:", error)
    return { success: false, error: "Error al sincronizar carrito" }
  }
}
