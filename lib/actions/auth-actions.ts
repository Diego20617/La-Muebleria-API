"use server"

import { redirect } from "next/navigation"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function signUp(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const nombre = formData.get("nombre") as string
    const apellido = formData.get("apellido") as string

    if (!email || !password) {
      return { error: "Email y contraseña son requeridos" }
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        data: {
          nombre,
          apellido,
        },
      },
    })

    if (error) {
      return { error: error.message }
    }

    return { success: "Revisa tu email para confirmar tu cuenta." }
  } catch (error) {
    console.error("Error in signUp:", error)
    return { error: "Error al registrar usuario" }
  }
}

export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { error: "Email y contraseña son requeridos" }
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    console.log("✅ LOGIN EXITOSO PARA:", email)

    // REDIRECCIÓN SIMPLE Y DIRECTA
    if (email === "admin@muebleriasanbernardo.cl") {
      console.log("🚀 REDIRIGIENDO ADMIN A /admin")
      redirect("/admin")
    }

    redirect("/")
  } catch (error) {
    console.error("❌ Error in signIn:", error)
    return { error: "Error al iniciar sesión" }
  }
}

export async function signOut() {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error("Error signing out:", error)
  }

  redirect("/")
}
