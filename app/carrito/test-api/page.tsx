"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testApi = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log("Iniciando test de API...")

      const response = await fetch("/api/carrito", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("Respuesta recibida:", response.status, response.statusText)

      const data = await response.json()
      console.log("Datos:", data)

      setResult({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        data,
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Error en test:", error)
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Error desconocido",
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Test de API del Carrito</h1>
          <p className="text-muted-foreground">
            Esta página prueba directamente la API /api/carrito para identificar problemas.
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Probar API</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testApi} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Probando API...
                </>
              ) : (
                "Probar /api/carrito"
              )}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Resultado del Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <strong>Estado:</strong>
                  <span className={`ml-2 ${result.success ? "text-green-600" : "text-red-600"}`}>
                    {result.success ? "✅ Éxito" : "❌ Error"}
                  </span>
                </div>

                {result.status && (
                  <div>
                    <strong>HTTP Status:</strong>
                    <span className="ml-2">
                      {result.status} {result.statusText}
                    </span>
                  </div>
                )}

                {result.error && (
                  <div>
                    <strong>Error:</strong>
                    <span className="ml-2 text-red-600">{result.error}</span>
                  </div>
                )}

                <div>
                  <strong>Timestamp:</strong>
                  <span className="ml-2">{result.timestamp}</span>
                </div>

                <div>
                  <strong>Datos Completos:</strong>
                  <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <Button asChild>
            <Link href="/carrito">Carrito Estático</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/">Inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
