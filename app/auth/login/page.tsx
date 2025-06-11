"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, Shield, Loader2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  const redirectTo = searchParams.get("next") || "/"

  // Mostrar mensaje si viene de reset password
  useEffect(() => {
    const message = searchParams.get("message")
    if (message === "password-updated") {
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente. Inicia sesión con tu nueva contraseña.",
      })
    }
  }, [searchParams, toast])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage({ type: "error", text: error.message })
        toast({
          title: "Error de autenticación",
          description: error.message,
          variant: "destructive",
        })
        return
      }

      if (data.user) {
        setMessage({ type: "success", text: "Inicio de sesión exitoso" })
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente",
        })

        // Verificar si es admin
        try {
          const response = await fetch("/api/check-admin")
          const adminData = await response.json()

          if (adminData.isAdmin) {
            router.push("/admin")
            toast({
              title: "Acceso de Administrador",
              description: "Redirigiendo al panel de administración...",
            })
          } else {
            router.push(redirectTo)
          }
        } catch (adminError) {
          console.error("Error checking admin status:", adminError)
          router.push(redirectTo)
        }

        // Forzar recarga para actualizar el estado de autenticación
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
      console.error("Error en login:", error)
      setMessage({ type: "error", text: "Error al iniciar sesión" })
      toast({
        title: "Error",
        description: "No se pudo iniciar sesión. Intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">🪑</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">Ingresa a tu cuenta de Mueblería San Bernardo</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {message && (
              <Alert
                className={message.type === "error" ? "border-red-500 text-red-700" : "border-green-500 text-green-700"}
              >
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-right">
              <Link href="/auth/reset-password" className="text-sm text-primary hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar Sesión"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link href="/auth/register" className="text-primary hover:underline">
                Regístrate aquí
              </Link>
            </div>

            <div className="text-center text-xs text-muted-foreground border-t pt-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-4 w-4" />
                <span className="font-semibold">Credenciales de Administrador:</span>
              </div>
              <p>Email: admin@muebleriasanbernardo.cl</p>
              <p>Password: admin123456</p>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
