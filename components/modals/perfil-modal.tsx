"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/components/auth-provider"

interface PerfilData {
  nombre: string
  apellido: string
  email: string
  telefono: string
  direccion: string
}

export function PerfilModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [perfilData, setPerfilData] = useState<PerfilData>({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
  })

  useEffect(() => {
    if (open && user) {
      loadPerfilData()
    } else if (open && !user) {
      setPerfilData({
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
        direccion: "",
      })
    }
  }, [open, user])

  const loadPerfilData = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/user-profile", { credentials: "include" })
      const data = await response.json()
      let perfil = data.profile || {}
      // Si no hay perfil, crear uno básico
      if (!perfil || Object.keys(perfil).length === 0) {
        perfil = {
          nombre: user?.user_metadata?.nombre || "",
          apellido: user?.user_metadata?.apellido || "",
          email: user?.email || "",
          telefono: "",
          direccion: "",
        }
      }
      setPerfilData({
        nombre: perfil.nombre || "",
        apellido: perfil.apellido || "",
        email: user?.email || perfil.email || "",
        telefono: perfil.telefono || "",
        direccion: perfil.direccion || "",
      })
    } catch (error) {
      console.error("Error cargando perfil:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del perfil",
        variant: "destructive",
      })
      setPerfilData({
        nombre: user?.user_metadata?.nombre || "",
        apellido: user?.user_metadata?.apellido || "",
        email: user?.email || "",
        telefono: "",
        direccion: "",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/user-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: perfilData.nombre,
          apellido: perfilData.apellido,
          telefono: perfilData.telefono,
          direccion: perfilData.direccion,
        }),
        credentials: "include",
      })

      if (!response.ok) throw new Error("Error guardando datos del perfil")

      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido actualizados correctamente",
      })
      // Recargar datos para reflejar cambios
      await loadPerfilData()
      onOpenChange(false)
    } catch (error) {
      console.error("Error guardando perfil:", error)
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPerfilData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Mi Perfil</DialogTitle>
          <DialogDescription>Actualiza tus datos personales. Haz clic en guardar cuando termines.</DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={perfilData.nombre}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  name="apellido"
                  value={perfilData.apellido}
                  onChange={handleChange}
                  placeholder="Tu apellido"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                value={perfilData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                disabled
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                value={perfilData.telefono}
                onChange={handleChange}
                placeholder="+56 9 1234 5678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                name="direccion"
                value={perfilData.direccion}
                onChange={handleChange}
                placeholder="Tu dirección"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading || saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
