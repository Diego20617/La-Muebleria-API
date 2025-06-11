"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { getCarrito, vaciarCarrito } from "./carrito-actions"

// Función para obtener el ID del usuario actual
async function getCurrentUserId() {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id
}

// Función para crear un nuevo pedido
export async function crearPedido(formData: FormData) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado", pedidoId: null }
  }

  // Obtener datos del carrito
  const { items, error: carritoError } = await getCarrito()

  if (carritoError) {
    return { success: false, error: carritoError, pedidoId: null }
  }

  if (!items.length) {
    return { success: false, error: "El carrito está vacío", pedidoId: null }
  }

  // Calcular total del pedido
  const total = items.reduce((sum, item) => {
    return sum + item.producto.precio * item.cantidad
  }, 0)

  // Obtener datos de envío del formulario
  const direccion = formData.get("direccion") as string
  const ciudad = formData.get("ciudad") as string
  const region = formData.get("region") as string
  const codigoPostal = formData.get("codigo_postal") as string
  const metodoPago = formData.get("metodo_pago") as string
  const notas = (formData.get("notas") as string) || ""

  const supabase = createServerSupabaseClient()

  // Iniciar transacción
  // Nota: Supabase no soporta transacciones directamente, así que manejamos los errores manualmente

  // 1. Crear pedido
  const { data: pedido, error: pedidoError } = await supabase
    .from("pedidos")
    .insert({
      usuario_id: userId,
      total,
      direccion_envio: direccion,
      ciudad_envio: ciudad,
      region_envio: region,
      codigo_postal_envio: codigoPostal,
      metodo_pago: metodoPago,
      notas,
      estado: "pendiente",
    })
    .select("id")
    .single()

  if (pedidoError) {
    console.error("Error al crear pedido:", pedidoError)
    return { success: false, error: pedidoError.message, pedidoId: null }
  }

  // 2. Crear detalles del pedido
  const detallesPedido = items.map((item) => ({
    pedido_id: pedido.id,
    producto_id: item.producto_id,
    cantidad: item.cantidad,
    precio_unitario: item.producto.precio,
    subtotal: item.producto.precio * item.cantidad,
  }))

  const { error: detallesError } = await supabase.from("detalles_pedido").insert(detallesPedido)

  if (detallesError) {
    console.error("Error al crear detalles del pedido:", detallesError)

    // Intentar eliminar el pedido creado para mantener consistencia
    await supabase.from("pedidos").delete().eq("id", pedido.id)

    return { success: false, error: detallesError.message, pedidoId: null }
  }

  // 3. Actualizar stock de productos
  for (const item of items) {
    const { error: stockError } = await supabase.rpc("actualizar_stock", {
      p_producto_id: item.producto_id,
      p_cantidad: item.cantidad,
    })

    if (stockError) {
      console.error("Error al actualizar stock:", stockError)
      // Continuamos con el proceso aunque haya error en el stock
    }
  }

  // 4. Vaciar carrito
  await vaciarCarrito()

  return { success: true, error: null, pedidoId: pedido.id }
}

// Función para obtener los pedidos de un usuario
export async function getPedidosUsuario() {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { pedidos: [], error: "Usuario no autenticado" }
  }

  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("pedidos")
    .select("*")
    .eq("usuario_id", userId)
    .order("fecha_pedido", { ascending: false })

  if (error) {
    console.error("Error al obtener pedidos:", error)
    return { pedidos: [], error: error.message }
  }

  return { pedidos: data, error: null }
}

// Función para obtener un pedido por ID
export async function getPedidoById(pedidoId: number) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { pedido: null, detalles: [], error: "Usuario no autenticado" }
  }

  const supabase = createServerSupabaseClient()

  // Obtener datos del pedido
  const { data: pedido, error: pedidoError } = await supabase
    .from("pedidos")
    .select("*")
    .eq("id", pedidoId)
    .eq("usuario_id", userId)
    .single()

  if (pedidoError) {
    console.error("Error al obtener pedido:", pedidoError)
    return { pedido: null, detalles: [], error: pedidoError.message }
  }

  // Obtener detalles del pedido
  const { data: detalles, error: detallesError } = await supabase
    .from("detalles_pedido")
    .select(`
      *,
      productos (*)
    `)
    .eq("pedido_id", pedidoId)

  if (detallesError) {
    console.error("Error al obtener detalles del pedido:", detallesError)
    return { pedido, detalles: [], error: detallesError.message }
  }

  return { pedido, detalles, error: null }
}

// Función para cancelar un pedido
export async function cancelarPedido(pedidoId: number) {
  const userId = await getCurrentUserId()

  if (!userId) {
    return { success: false, error: "Usuario no autenticado" }
  }

  const supabase = createServerSupabaseClient()

  // Verificar que el pedido pertenece al usuario y está en estado pendiente
  const { data: pedido, error: pedidoError } = await supabase
    .from("pedidos")
    .select("estado")
    .eq("id", pedidoId)
    .eq("usuario_id", userId)
    .single()

  if (pedidoError) {
    console.error("Error al verificar pedido:", pedidoError)
    return { success: false, error: pedidoError.message }
  }

  if (!pedido) {
    return { success: false, error: "Pedido no encontrado" }
  }

  if (pedido.estado !== "pendiente") {
    return { success: false, error: "Solo se pueden cancelar pedidos pendientes" }
  }

  // Actualizar estado del pedido
  const { error: updateError } = await supabase
    .from("pedidos")
    .update({ estado: "cancelado" })
    .eq("id", pedidoId)
    .eq("usuario_id", userId)

  if (updateError) {
    console.error("Error al cancelar pedido:", updateError)
    return { success: false, error: updateError.message }
  }

  // Restaurar stock de productos
  const { data: detalles } = await supabase
    .from("detalles_pedido")
    .select("producto_id, cantidad")
    .eq("pedido_id", pedidoId)

  if (detalles) {
    for (const detalle of detalles) {
      await supabase.rpc("restaurar_stock", {
        p_producto_id: detalle.producto_id,
        p_cantidad: detalle.cantidad,
      })
    }
  }

  return { success: true, error: null }
}
