"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function DiagnosticoPage() {
  const [tests, setTests] = useState<any[]>([])
  const [running, setRunning] = useState(false)

  const runDiagnostics = async () => {
    setRunning(true)
    const results = []

    // Test 1: API básica
    try {
      const response = await fetch("/api/carrito")
      results.push({
        name: "API Carrito Básica",
        status: response.ok ? "success" : "error",
        details: `Status: ${response.status} ${response.statusText}`,
      })
    } catch (error) {
      results.push({
        name: "API Carrito Básica",
        status: "error",
        details: `Error: ${error instanceof Error ? error.message : "Unknown"}`,
      })
    }

    // Test 2: Conectividad general
    try {
      const response = await fetch("/api/health")
      results.push({
        name: "Conectividad API",
        status: response.ok ? "success" : "warning",
        details: response.ok ? "API responde correctamente" : "API no responde",
      })
    } catch (error) {
      results.push({
        name: "Conectividad API",
        status: "error",
        details: "No se puede conectar con la API",
      })
    }

    // Test 3: Variables de entorno
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL
    results.push({
      name: "Variables de Entorno",
      status: hasSupabaseUrl ? "success" : "warning",
      details: hasSupabaseUrl ? "Variables configuradas" : "Algunas variables pueden faltar",
    })

    // Test 4: LocalStorage
    try {
      localStorage.setItem("test", "test")
      localStorage.removeItem("test")
      results.push({
        name: "LocalStorage",
        status: "success",
        details: "LocalStorage funciona correctamente",
      })
    } catch (error) {
      results.push({
        name: "LocalStorage",
        status: "error",
        details: "LocalStorage no disponible",
      })
    }

    setTests(results)
    setRunning(false)
  }

  const getIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Diagnóstico del Carrito</h1>
          <p className="text-muted-foreground">
            Esta página ejecuta pruebas para identificar problemas con el carrito de compras.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ejecutar Diagnóstico</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={runDiagnostics} disabled={running} className="w-full">
              {running ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Ejecutando pruebas...
                </>
              ) : (
                "Ejecutar Diagnóstico"
              )}
            </Button>
          </CardContent>
        </Card>

        {tests.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Resultados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tests.map((test, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    {getIcon(test.status)}
                    <div className="flex-1">
                      <h3 className="font-medium">{test.name}</h3>
                      <p className="text-sm text-muted-foreground">{test.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <strong>User Agent:</strong>
                <p className="text-muted-foreground break-all">{navigator.userAgent}</p>
              </div>
              <div>
                <strong>URL:</strong>
                <p className="text-muted-foreground">{window.location.href}</p>
              </div>
              <div>
                <strong>Timestamp:</strong>
                <p className="text-muted-foreground">{new Date().toISOString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex gap-2">
          <Button asChild>
            <Link href="/carrito">Volver al Carrito</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
