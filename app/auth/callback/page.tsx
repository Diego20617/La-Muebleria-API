"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = getSupabaseClient()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Obtener el código de la URL
        const url = new URL(window.location.href)
        const code = url.searchParams.get("code")
        const next = url.searchParams.get("next") || "/"

        if (!code) {
          setError("No se encontró el código de autenticación")
          setLoading(false)
          return
        }

        // Intercambiar el código por una sesión
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          console.error("Error en el intercambio de código:", exchangeError)
          setError(exchangeError.message)
          setLoading(false)
          return
        }

        // Verificar si el usuario está autenticado
        const { data: sessionData } = await supabase.auth.getSession()

        if (!sessionData.session) {
          setError("No se pudo iniciar sesión")
          setLoading(false)
          return
        }

        // Verificar si es administrador
        const { data: perfil } = await supabase
          .from("perfiles")
          .select("rol")
          .eq("id", sessionData.session.user.id)
          .single()

        // Redirigir según el rol
        if (perfil?.rol === "admin") {
          router.push("/admin")
        } else {
          router.push(next)
        }
      } catch (error) {
        console.error("Error en el callback de autenticación:", error)
        setError("Error en la autenticación")
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [router, supabase.auth])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error de autenticación</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push("/auth/login")}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Volver al inicio de sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Completando autenticación...</p>
      </div>
    </div>
  )
}
