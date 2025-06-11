import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ isAdmin: false, message: "No user found" })
    }

    // Verificación simple por email
    const isAdmin = user.email === "admin@muebleriasanbernardo.cl"

    if (isAdmin) {
      return NextResponse.json({
        isAdmin: true,
        user: {
          id: user.id,
          email: user.email,
          nombre: "Administrador",
          apellido: "Sistema",
          rol: "admin",
        },
        message: "Admin access granted",
      })
    }

    // Para usuarios regulares, intentar obtener el perfil
    const { data: perfil } = await supabase.from("perfiles").select("rol, nombre, apellido").eq("id", user.id).single()

    return NextResponse.json({
      isAdmin: false,
      user: {
        id: user.id,
        email: user.email,
        nombre: perfil?.nombre || "Usuario",
        apellido: perfil?.apellido || "",
        rol: perfil?.rol || "cliente",
      },
      message: "Regular user access",
    })
  } catch (error) {
    console.error("Error en check-admin:", error)
    return NextResponse.json(
      {
        isAdmin: false,
        message: "Server error checking admin status",
      },
      { status: 500 },
    )
  }
}
