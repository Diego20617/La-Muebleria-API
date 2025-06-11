"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Lock, Globe } from "lucide-react"

export function ConfiguracionModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState({
    notificaciones: {
      email: true,
      ofertas: false,
      pedidos: true,
      newsletter: false,
    },
    privacidad: {
      compartirDatos: false,
      perfilPublico: false,
    },
    preferencias: {
      idioma: "es",
      moneda: "CLP",
    },
  })

  const handleSwitchChange = (category: string, setting: string, checked: boolean) => {
    setConfig((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: checked,
      },
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulamos guardar la configuración
      await new Promise((resolve) => setTimeout(resolve, 800))

      toast({
        title: "Configuración guardada",
        description: "Tus preferencias han sido actualizadas",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar la configuración",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configuración</DialogTitle>
          <DialogDescription>Personaliza tus preferencias y ajustes de cuenta</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="notificaciones" className="py-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="notificaciones" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Notificaciones</span>
            </TabsTrigger>
            <TabsTrigger value="privacidad" className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              <span>Privacidad</span>
            </TabsTrigger>
            <TabsTrigger value="preferencias" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>Preferencias</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notificaciones" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notif">Notificaciones por email</Label>
                <p className="text-sm text-muted-foreground">Recibe actualizaciones importantes por email</p>
              </div>
              <Switch
                id="email-notif"
                checked={config.notificaciones.email}
                onCheckedChange={(checked) => handleSwitchChange("notificaciones", "email", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="ofertas-notif">Ofertas y promociones</Label>
                <p className="text-sm text-muted-foreground">Recibe ofertas especiales y descuentos</p>
              </div>
              <Switch
                id="ofertas-notif"
                checked={config.notificaciones.ofertas}
                onCheckedChange={(checked) => handleSwitchChange("notificaciones", "ofertas", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="pedidos-notif">Actualizaciones de pedidos</Label>
                <p className="text-sm text-muted-foreground">Notificaciones sobre el estado de tus pedidos</p>
              </div>
              <Switch
                id="pedidos-notif"
                checked={config.notificaciones.pedidos}
                onCheckedChange={(checked) => handleSwitchChange("notificaciones", "pedidos", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="newsletter-notif">Newsletter mensual</Label>
                <p className="text-sm text-muted-foreground">Recibe nuestro boletín con novedades</p>
              </div>
              <Switch
                id="newsletter-notif"
                checked={config.notificaciones.newsletter}
                onCheckedChange={(checked) => handleSwitchChange("notificaciones", "newsletter", checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="privacidad" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="compartir-datos">Compartir datos de uso</Label>
                <p className="text-sm text-muted-foreground">Ayúdanos a mejorar compartiendo datos anónimos</p>
              </div>
              <Switch
                id="compartir-datos"
                checked={config.privacidad.compartirDatos}
                onCheckedChange={(checked) => handleSwitchChange("privacidad", "compartirDatos", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="perfil-publico">Perfil público</Label>
                <p className="text-sm text-muted-foreground">Permite que otros usuarios vean tu perfil</p>
              </div>
              <Switch
                id="perfil-publico"
                checked={config.privacidad.perfilPublico}
                onCheckedChange={(checked) => handleSwitchChange("privacidad", "perfilPublico", checked)}
              />
            </div>
          </TabsContent>

          <TabsContent value="preferencias" className="space-y-4">
            <div className="space-y-2">
              <Label>Idioma</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={config.preferencias.idioma}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    preferencias: {
                      ...prev.preferencias,
                      idioma: e.target.value,
                    },
                  }))
                }
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Moneda</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={config.preferencias.moneda}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    preferencias: {
                      ...prev.preferencias,
                      moneda: e.target.value,
                    },
                  }))
                }
              >
                <option value="CLP">Peso Chileno (CLP)</option>
                <option value="USD">Dólar Estadounidense (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
