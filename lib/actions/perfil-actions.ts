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

// Función para obtener el perfil del usuario actual
export async function getPerfil() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { perfil: null, error: "Usuario no autenticado" }
  }

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("perfiles").select("*").eq("id", userId).single()

  if (error) {
    console.error("Error al obtener perfil:", error)
    return { perfil: null, error: error.message }
  }

  return { perfil: data, error: null }
}

// Función para actualizar el perfil del usuario
export async function actualizarPerfil(formData: FormData) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  const nombre = formData.get("nombre") as string
  const apellido = formData.get("apellido") as string
  const direccion = formData.get("direccion") as string
  const ciudad = formData.get("ciudad") as string
  const region = formData.get("region") as string
  const codigoPostal = formData.get("codigoPostal") as string

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("perfiles")
    .update({ nombre, apellido, direccion, ciudad, region, codigo_postal: codigoPostal })
    .eq("id", userId)
    .select()

  if (error) {
    console.error("Error al actualizar perfil:", error)
    return { success: false, error: error.message }
  }

  return { success: true, data }
}
