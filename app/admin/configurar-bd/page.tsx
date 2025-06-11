"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Database, Settings, Play, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseClient } from "@/lib/supabase/client"

interface ConfigStep {
  id: string
  title: string
  description: string
  sql: string
  completed: boolean
  error?: string
}

export default function ConfigurarBDPage() {
  const { toast } = useToast()
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState<string | null>(null)
  const supabase = getSupabaseClient()

  const [steps, setSteps] = useState<ConfigStep[]>([
    {
      id: "disable-rls-productos",
      title: "Deshabilitar RLS en productos",
      description: "Permite que cualquiera pueda ver los productos",
      sql: "ALTER TABLE productos DISABLE ROW LEVEL SECURITY;",
      completed: false,
    },
    {
      id: "disable-rls-categorias",
      title: "Deshabilitar RLS en categorías",
      description: "Permite que cualquiera pueda ver las categorías",
      sql: "ALTER TABLE categorias DISABLE ROW LEVEL SECURITY;",
      completed: false,
    },
    {
      id: "create-carrito-table",
      title: "Crear tabla carrito",
      description: "Crea la tabla del carrito si no existe",
      sql: `CREATE TABLE IF NOT EXISTS public.carrito (
        id SERIAL PRIMARY KEY,
        usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        producto_id INTEGER NOT NULL REFERENCES productos(id) ON DELETE CASCADE,
        cantidad INTEGER NOT NULL DEFAULT 1,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(usuario_id, producto_id)
      );`,
      completed: false,
    },
    {
      id: "enable-rls-carrito",
      title: "Habilitar RLS en carrito",
      description: "Activa la seguridad a nivel de fila para el carrito",
      sql: "ALTER TABLE public.carrito ENABLE ROW LEVEL SECURITY;",
      completed: false,
    },
    {
      id: "create-carrito-policies",
      title: "Crear políticas del carrito",
      description: "Permite que los usuarios gestionen su propio carrito",
      sql: `
        DROP POLICY IF EXISTS "Usuarios pueden ver su propio carrito" ON public.carrito;
        CREATE POLICY "Usuarios pueden ver su propio carrito" ON public.carrito
          FOR SELECT USING (auth.uid() = usuario_id);
        
        DROP POLICY IF EXISTS "Usuarios pueden agregar a su propio carrito" ON public.carrito;
        CREATE POLICY "Usuarios pueden agregar a su propio carrito" ON public.carrito
          FOR INSERT WITH CHECK (auth.uid() = usuario_id);
        
        DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio carrito" ON public.carrito;
        CREATE POLICY "Usuarios pueden actualizar su propio carrito" ON public.carrito
          FOR UPDATE USING (auth.uid() = usuario_id);
        
        DROP POLICY IF EXISTS "Usuarios pueden eliminar de su propio carrito" ON public.carrito;
        CREATE POLICY "Usuarios pueden eliminar de su propio carrito" ON public.carrito
          FOR DELETE USING (auth.uid() = usuario_id);
      `,
      completed: false,
    },
    {
      id: "create-indexes",
      title: "Crear índices",
      description: "Mejora el rendimiento de las consultas del carrito",
      sql: `
        CREATE INDEX IF NOT EXISTS idx_carrito_usuario_id ON public.carrito(usuario_id);
        CREATE INDEX IF NOT EXISTS idx_carrito_producto_id ON public.carrito(producto_id);
      `,
      completed: false,
    },
  ])

  const executeStep = async (step: ConfigStep) => {
    setCurrentStep(step.id)
    setIsRunning(true)

    try {
      console.log(`Ejecutando: ${step.title}`)
      console.log(`SQL: ${step.sql}`)

      const { error } = await supabase.rpc("execute_sql", { sql_query: step.sql })

      if (error) {
        console.error(`Error en ${step.title}:`, error)

        // Actualizar el step con error
        setSteps((prev) => prev.map((s) => (s.id === step.id ? { ...s, error: error.message } : s)))

        toast({
          title: "Error",
          description: `Error en ${step.title}: ${error.message}`,
          variant: "destructive",
        })
      } else {
        console.log(`✅ ${step.title} completado`)

        // Marcar como completado
        setSteps((prev) => prev.map((s) => (s.id === step.id ? { ...s, completed: true, error: undefined } : s)))

        toast({
          title: "Éxito",
          description: `${step.title} completado correctamente`,
        })
      }
    } catch (error) {
      console.error(`Error ejecutando ${step.title}:`, error)

      setSteps((prev) =>
        prev.map((s) =>
          s.id === step.id ? { ...s, error: error instanceof Error ? error.message : "Error desconocido" } : s,
        ),
      )

      toast({
        title: "Error",
        description: `Error ejecutando ${step.title}`,
        variant: "destructive",
      })
    } finally {
      setCurrentStep(null)
      setIsRunning(false)
    }
  }

  const executeAllSteps = async () => {
    setIsRunning(true)

    for (const step of steps) {
      if (!step.completed) {
        await executeStep(step)
        // Esperar un poco entre pasos
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    setIsRunning(false)

    toast({
      title: "Configuración completada",
      description: "Todos los pasos se han ejecutado",
    })
  }

  const completedSteps = steps.filter((s) => s.completed).length
  const totalSteps = steps.length

  return (
    <div className="min-h-screen bg-black py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <Database className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Configurar Base de Datos</h1>
          <Badge variant={completedSteps === totalSteps ? "default" : "secondary"}>
            {completedSteps}/{totalSteps} completados
          </Badge>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración Manual de la Base de Datos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Esta página te permite configurar manualmente la base de datos ejecutando los comandos SQL necesarios.
              Cada paso se ejecuta individualmente para mayor control.
            </p>

            <div className="flex gap-2">
              <Button
                onClick={executeAllSteps}
                disabled={isRunning || completedSteps === totalSteps}
                className="flex items-center gap-2"
              >
                {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Ejecutar Todos los Pasos
              </Button>

              <Button variant="outline" onClick={() => window.location.reload()}>
                Recargar Estado
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {steps.map((step, index) => (
            <Card
              key={step.id}
              className={step.completed ? "border-green-200 bg-green-50" : step.error ? "border-red-200 bg-red-50" : ""}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-sm font-medium">
                      {step.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : step.error ? (
                        <XCircle className="h-5 w-5 text-red-600" />
                      ) : (
                        index + 1
                      )}
                    </div>

                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {step.error && <p className="text-sm text-red-600 mt-1">Error: {step.error}</p>}
                    </div>
                  </div>

                  <Button
                    onClick={() => executeStep(step)}
                    disabled={isRunning || step.completed}
                    variant={step.completed ? "outline" : "default"}
                    size="sm"
                  >
                    {currentStep === step.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : step.completed ? (
                      "Completado"
                    ) : (
                      "Ejecutar"
                    )}
                  </Button>
                </div>

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Ver comando SQL
                  </summary>
                  <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-x-auto">{step.sql}</pre>
                </details>
              </CardContent>
            </Card>
          ))}
        </div>

        {completedSteps === totalSteps && (
          <Card className="mt-6 border-green-200 bg-green-50">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-green-800 mb-2">¡Configuración Completada!</h2>
              <p className="text-green-700 mb-4">
                La base de datos ha sido configurada correctamente. Ahora el carrito debería funcionar perfectamente.
              </p>
              <Button asChild>
                <a href="/carrito">Probar Carrito</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
