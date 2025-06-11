import { createServerSupabaseClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Obtener el usuario actual
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Verificar si es administrador
        const { data: perfil } = await supabase.from("perfiles").select("rol").eq("id", user.id).single()

        // Redirigir según el rol
        if (perfil?.rol === "admin") {
          return NextResponse.redirect(`${origin}/admin`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Si hay error, redirigir al login
  return NextResponse.redirect(`${origin}/auth/login?error=callback_error`)
}
