import type React from "react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // SIN VERIFICACIONES - ACCESO DIRECTO
  return <>{children}</>
}
