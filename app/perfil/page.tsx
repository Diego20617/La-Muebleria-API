"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseClient } from "@/lib/supabase/client"

export default function PerfilPage() {
  const { user } = useAuth()
  const [perfil, setPerfil] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const supabase = getSupabaseClient()

  useEffect(() => {
    async function loadPerfil() {
      if (!user) return

      try {
        const { data, error } = await supabase.from("perfiles").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error cargando perfil:", error)
          // Crear perfil si no existe
          const { data: newProfile, error: insertError } = await supabase
            .from("perfiles")
            .insert({
              id: user.id,
              nombre: "",
              apellido: "",
              rol: "cliente",
            })
            .select()
            .single()

          if (insertError) {
            console.error("Error creando perfil:", insertError)
          } else {
            setPerfil(newProfile)
          }
        } else {
          setPerfil(data)
        }
      } catch (error) {
        console.error("Error:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPerfil()
  }, [user, supabase])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const formData = new FormData(e.currentTarget)
    const updates = {
      nombre: formData.get("nombre") as string,
      apellido: formData.get("apellido") as string,
      direccion: formData.get("direccion") as string,
      ciudad: formData.get("ciudad") as string,
      region: formData.get("region") as string,
      codigo_postal: formData.get("codigo_postal") as string,
      telefono: formData.get("telefono") as string,
    }

    try {
      const { error } = await supabase.from("perfiles").update(updates).eq("id", user?.id)

      if (error) {
        setMessage({ type: "error", text: error.message })
      } else {
        setMessage({ type: "success", text: "Perfil actualizado correctamente" })
        setPerfil({ ...perfil, ...updates })
      }
    } catch (error) {
      console.error("Error:", error)
      setMessage({ type: "error", text: "Error al actualizar perfil" })
    } finally {
      setSaving(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Acceso Denegado</h2>
          <p>Debes iniciar sesión para ver tu perfil.</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Mi Perfil</CardTitle>
            <CardDescription>Actualiza tu información personal y de contacto</CardDescription>
          </CardHeader>
          <CardContent>
            {message && (
              <Alert
                className={message.type === "error" ? "border-red-500 text-red-700" : "border-green-500 text-green-700"}
              >
                <AlertDescription>{message.text}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input id="nombre" name="nombre" defaultValue={perfil?.nombre || ""} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellido">Apellido</Label>
                  <Input id="apellido" name="apellido" defaultValue={perfil?.apellido || ""} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" name="direccion" defaultValue={perfil?.direccion || ""} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input id="ciudad" name="ciudad" defaultValue={perfil?.ciudad || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="region">Región</Label>
                  <Input id="region" name="region" defaultValue={perfil?.region || ""} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="codigo_postal">Código Postal</Label>
                  <Input id="codigo_postal" name="codigo_postal" defaultValue={perfil?.codigo_postal || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" name="telefono" type="tel" defaultValue={perfil?.telefono || ""} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={user.email || ""} disabled />
                <p className="text-xs text-muted-foreground">El email no se puede cambiar</p>
              </div>

              <Button type="submit" disabled={saving} className="w-full">
                {saving ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
