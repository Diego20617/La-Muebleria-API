"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function getAdminStatistics() {
  const supabase = createServerSupabaseClient()

  try {
    // Obtener estadísticas en paralelo
    const [
      { count: totalUsuarios },
      { count: totalProductos },
      { count: pedidosPendientes },
      { data: ventasData },
      { data: ultimosUsuarios },
      { data: ultimosPedidos },
    ] = await Promise.all([
      // Total usuarios
      supabase
        .from("perfiles")
        .select("*", { count: "exact", head: true }),

      // Total productos
      supabase
        .from("productos")
        .select("*", { count: "exact", head: true }),

      // Pedidos pendientes
      supabase
        .from("pedidos")
        .select("*", { count: "exact", head: true })
        .eq("estado", "pendiente"),

      // Ventas del mes
      supabase
        .from("pedidos")
        .select("total")
        .gte("fecha_pedido", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
        .in("estado", ["pagado", "enviado", "entregado"]),

      // Últimos 5 usuarios registrados
      supabase
        .from("perfiles")
        .select("id, nombre, apellido, email, created_at, rol")
        .order("created_at", { ascending: false })
        .limit(5),

      // Últimos 5 pedidos
      supabase
        .from("pedidos")
        .select(`
          id,
          total,
          estado,
          fecha_pedido,
          usuario_id,
          perfiles:usuario_id (
            nombre,
            apellido,
            email
          )
        `)
        .order("fecha_pedido", { ascending: false })
        .limit(5),
    ])

    // Calcular ventas del mes
    const ventasDelMes = ventasData?.reduce((sum, pedido) => sum + (pedido.total || 0), 0) || 0

    return {
      totalUsuarios: totalUsuarios || 0,
      totalProductos: totalProductos || 0,
      pedidosPendientes: pedidosPendientes || 0,
      ventasDelMes,
      ultimosUsuarios: ultimosUsuarios || [],
      ultimosPedidos: ultimosPedidos || [],
      error: null,
    }
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error)
    return {
      totalUsuarios: 0,
      totalProductos: 0,
      pedidosPendientes: 0,
      ventasDelMes: 0,
      ultimosUsuarios: [],
      ultimosPedidos: [],
      error: "Error al cargar estadísticas",
    }
  }
}

export async function getRecentUsers() {
  const supabase = createServerSupabaseClient()

  try {
    const { data: usuarios, error } = await supabase
      .from("perfiles")
      .select("id, nombre, apellido, email, created_at, rol")
      .order("created_at", { ascending: false })
      .limit(10)

    if (error) throw error

    return {
      usuarios: usuarios || [],
      error: null,
    }
  } catch (error) {
    console.error("Error obteniendo usuarios recientes:", error)
    return {
      usuarios: [],
      error: "Error al cargar usuarios",
    }
  }
}
