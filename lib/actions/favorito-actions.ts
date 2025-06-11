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

// Función para obtener los favoritos de un usuario
export async function getFavoritos() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { favoritos: [], error: "Usuario no autenticado" }
  }

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("favoritos")
    .select(`
      producto_id,
      productos (*)
    `)
    .eq("usuario_id", userId)

  if (error) {
    console.error("Error al obtener favoritos:", error)
    return { favoritos: [], error: error.message }
  }

  const favoritos = data.map((item) => ({
    id: item.producto_id,
    ...item.productos,
  }))

  return { favoritos, error: null }
}

// Función para agregar un producto a favoritos
export async function agregarFavorito(productoId: number) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("favoritos").insert({
    usuario_id: userId,
    producto_id: productoId,
  })

  if (error) {
    // Si el error es por duplicado, no lo consideramos un error real
    if (error.code === "23505") {
      return { success: true, error: null }
    }

    console.error("Error al agregar favorito:", error)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

// Función para eliminar un producto de favoritos
export async function eliminarFavorito(productoId: number) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("favoritos").delete().eq("usuario_id", userId).eq("producto_id", productoId)

  if (error) {
    console.error("Error al eliminar favorito:", error)
    return { success: false, error: error.message }
  }

  return { success: true, error: null }
}

// Función para verificar si un producto está en favoritos
export async function esFavorito(productoId: number) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { esFavorito: false, error: null }
  }

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("favoritos")
    .select("id")
    .eq("usuario_id", userId)
    .eq("producto_id", productoId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // No encontrado
      return { esFavorito: false, error: null }
    }

    console.error("Error al verificar favorito:", error)
    return { esFavorito: false, error: error.message }
  }

  return { esFavorito: true, error: null }
}
