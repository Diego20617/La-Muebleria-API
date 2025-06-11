"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, LogOut, ShoppingCart, Heart, Settings, Package, ChevronDown, Shield, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-provider"
import { getSupabaseClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/hooks/use-cart"
import { PerfilModal } from "@/components/modals/perfil-modal"
import { PedidosModal } from "@/components/modals/pedidos-modal"
import { ConfiguracionModal } from "@/components/modals/configuracion-modal"

export function UserMenu() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isAdmin, setIsAdmin] = useState(false)
  const supabase = getSupabaseClient()
  const { itemCount } = useCart()

  // Estados para los modales
  const [perfilModalOpen, setPerfilModalOpen] = useState(false)
  const [pedidosModalOpen, setPedidosModalOpen] = useState(false)
  const [configModalOpen, setConfigModalOpen] = useState(false)

  useEffect(() => {
    if (user && user.email === "admin@muebleriasanbernardo.cl") {
      setIsAdmin(true)
    }
  }, [user])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push("/")
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión exitosamente",
      })
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "No se pudo cerrar sesión",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div data-testid="loading-skeleton" className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/carrito" className="relative">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {itemCount}
              </span>
            )}
          </Button>
        </Link>
        <Button variant="outline" size="sm" asChild>
          <Link href="/auth/login">Iniciar Sesión</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/auth/register">Registrarse</Link>
        </Button>
      </div>
    )
  }

  const displayName = user.email === "admin@muebleriasanbernardo.cl" ? "admin" : user.email?.split("@")[0] || "Usuario"

  return (
    <>
      <div className="flex items-center gap-2">
        <Link href="/carrito" className="relative">
          <Button variant="ghost" size="icon">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">
                {itemCount}
              </span>
            )}
          </Button>
        </Link>
        <Link href="/favoritos">
          <Button variant="ghost" size="icon">
            <Heart className="h-5 w-5" />
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">{displayName}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                {isAdmin && (
                  <div className="flex items-center gap-1 text-xs text-primary font-medium">
                    <Shield className="h-3 w-3" />
                    <span>Administrador</span>
                  </div>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={() => setPerfilModalOpen(true)} className="cursor-pointer">
              <User className="h-4 w-4 mr-2" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setPedidosModalOpen(true)} className="cursor-pointer">
              <Package className="h-4 w-4 mr-2" />
              <span>Mis Pedidos</span>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
              <Link href="/mis-resenas" className="flex items-center gap-2 cursor-pointer">
                <Star className="h-4 w-4" />
                <span>Mis Reseñas</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setConfigModalOpen(true)} className="cursor-pointer">
              <Settings className="h-4 w-4 mr-2" />
              <span>Configuración</span>
            </DropdownMenuItem>

            {isAdmin && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin" className="flex items-center gap-2 cursor-pointer text-primary">
                    <Shield className="h-4 w-4" />
                    <span className="font-semibold">Panel de Administración</span>
                  </Link>
                </DropdownMenuItem>
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 cursor-pointer">
              <LogOut className="h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Modales */}
      <PerfilModal open={perfilModalOpen} onOpenChange={setPerfilModalOpen} />
      <PedidosModal open={pedidosModalOpen} onOpenChange={setPedidosModalOpen} />
      <ConfiguracionModal open={configModalOpen} onOpenChange={setConfigModalOpen} />
    </>
  )
}
