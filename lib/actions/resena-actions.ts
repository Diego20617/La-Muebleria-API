"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

// Función para obtener el ID del usuario actual
async function getCurrentUserId() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id
}

// Función para agregar una reseña
export async function agregarResena(productoId: number, calificacion: number, comentario: string) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  const supabase = createServerSupabaseClient()

  // Verificar si el usuario ya ha reseñado este producto
  const { data: existente } = await supabase
    .from("resenas")
    .select("id")
    .eq("usuario_id", userId)
    .eq("producto_id", productoId)
    .single()

  if (existente) {
    // Actualizar reseña existente
    const { error } = await supabase
      .from("resenas")
      .update({
        calificacion,
        comentario,
        fecha: new Date().toISOString(),
      })
      .eq("id", existente.id)

    if (error) {
      console.error("Error al actualizar reseña:", error)
      return { success: false, error: error.message }
    }
  } else {
    // Crear nueva reseña
    const { error } = await supabase.from("resenas").insert({
      producto_id: productoId,
      usuario_id: userId,
      calificacion,
      comentario,
    })

    if (error) {
      console.error("Error al agregar reseña:", error)
      return { success: false, error: error.message }
    }
  }

  return { success: true, error: null }
}

// Función para eliminar una reseña
export async function eliminarResena(resenaId: number) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("resenas").delete().eq("id", resenaId).eq("usuario_id", userId)

  if (error) {
    console.error("Error al eliminar reseña:", error)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

// Función para obtener las reseñas de un producto
export async function getResenasProducto(productoId: number) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("resenas")
    .select(`
      *,
      perfiles (
        nombre,
        apellido
      )
    `)
    .eq("producto_id", productoId)
    .order("fecha", { ascending: false })

  if (error) {
    console.error("Error al obtener reseñas:", error)
    return { resenas: [], error: error.message }
  }

  return { resenas: data, error: null }
}

// Función para verificar si un usuario puede reseñar un producto
export async function puedeResenar(productoId: number) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { puede: false, error: "Usuario no autenticado" }
  }

  const supabase = createServerSupabaseClient()

  // Verificar si el usuario ha comprado el producto
  const { data, error } = await supabase
    .from("detalles_pedido")
    .select(`
      id,
      pedidos!inner (
        id,
        usuario_id,
        estado
      )
    `)
    .eq("producto_id", productoId)
    .eq("pedidos.usuario_id", userId)
    .eq("pedidos.estado", "entregado")
    .limit(1)

  if (error) {
    console.error("Error al verificar compra:", error)
    return { puede: false, error: error.message }
  }

  return { puede: data.length > 0, error: null }
}
