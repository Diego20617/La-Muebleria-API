"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/hooks/use-auth"

export function AdminCheck({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const response = await fetch("/api/check-admin")
        const data = await response.json()
        setIsAdmin(data.isAdmin)
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdmin()
  }, [user])

  if (loading) {
    return <div>Verificando permisos...</div>
  }

  if (!isAdmin) {
    return <div>No tienes permisos para acceder a esta página.</div>
  }

  return <>{children}</>
}
