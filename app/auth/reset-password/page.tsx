"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { toast } = useToast()
  const supabase = getSupabaseClient()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      // Usar la URL correcta del sitio en producción
      const redirectUrl =
        process.env.NODE_ENV === "production"
          ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password/confirm`
          : `${window.location.origin}/auth/reset-password/confirm`

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      })

      if (error) {
        setMessage({ type: "error", text: error.message })
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setIsSuccess(true)
        setMessage({
          type: "success",
          text: "Se ha enviado un enlace de recuperación a tu correo electrónico",
        })
        toast({
          title: "Correo enviado",
          description: "Revisa tu bandeja de entrada para restablecer tu contraseña",
        })
      }
    } catch (error) {
      console.error("Error en reset password:", error)
      setMessage({ type: "error", text: "Error al enviar el correo de recuperación" })
      toast({
        title: "Error",
        description: "No se pudo enviar el correo de recuperación",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl">Correo Enviado</CardTitle>
            <CardDescription>Hemos enviado un enlace de recuperación a tu correo electrónico</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Revisa tu bandeja de entrada y haz clic en el enlace para restablecer tu contraseña.
              </p>
              <p className="text-xs text-muted-foreground">Si no ves el correo, revisa tu carpeta de spam.</p>
              <div className="bg-blue-50 p-3 rounded-lg mt-4">
                <p className="text-xs text-blue-700">
                  <strong>Nota:</strong> El enlace te llevará a una página segura donde podrás crear tu nueva
                  contraseña.
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button asChild className="w-full">
              <Link href="/auth/login">Volver al Login</Link>
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setIsSuccess(false)
                setEmail("")
                setMessage(null)
              }}
              className="w-full"
            >
              Enviar a otro correo
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2 mb-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/auth/login">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="h-12 w-12 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-2xl">🪑</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Recuperar Contraseña</CardTitle>
          <CardDescription>
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
          </CardDescription>
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
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="bg-yellow-50 p-3 rounded-lg">
              <p className="text-xs text-yellow-700">
                <strong>Importante:</strong> El enlace del correo te llevará a una página donde podrás crear tu nueva
                contraseña de forma segura.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Enviando..." : "Enviar Enlace de Recuperación"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              ¿Recordaste tu contraseña?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Volver al login
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
