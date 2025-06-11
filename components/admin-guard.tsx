"use client"

import type React from "react"
import { useAuth } from "@/components/auth-provider"
import { Shield } from "lucide-react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth()

  // Solo mostrar loading mientras se carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div data-testid="loading-spinner" className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario O no es admin, mostrar mensaje pero NO redirigir
  if (!user || user.email !== "admin@muebleriasanbernardo.cl") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield data-testid="shield-icon" className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-4">Acceso Denegado</h2>
          <p className="mb-4">No tienes permisos para acceder al panel de administración.</p>
          <p className="text-sm text-gray-500">Usuario actual: {user?.email || "No autenticado"}</p>
        </div>
      </div>
    )
  }

  // Si llegamos aquí, el usuario es admin válido
  return <>{children}</>
}
