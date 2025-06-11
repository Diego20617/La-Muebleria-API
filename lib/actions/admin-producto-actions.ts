"use server"

import { createServerSupabaseClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function crearProducto(formData: FormData) {
  const supabase = createServerSupabaseClient()

  try {
    const precio = Number.parseInt(formData.get("precio") as string)
    const precio_anterior = formData.get("precio_anterior")
      ? Number.parseInt(formData.get("precio_anterior") as string)
      : null
    const stock = Number.parseInt(formData.get("stock") as string)
    const categoria_id = Number.parseInt(formData.get("categoria_id") as string)

    // Calcular descuento automáticamente si hay precio anterior
    let descuento = null
    if (precio_anterior && precio_anterior > precio) {
      descuento = Math.round(((precio_anterior - precio) / precio_anterior) * 100)
    }

    const { data, error } = await supabase
      .from("productos")
      .insert({
        nombre: formData.get("nombre") as string,
        descripcion: formData.get("descripcion") as string,
        precio,
        precio_anterior,
        descuento,
        stock,
        categoria_id,
        imagen_url: (formData.get("imagen_url") as string) || "/placeholder.svg",
        destacado: formData.get("destacado") === "true",
        nuevo: formData.get("nuevo") === "true",
      })
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/productos")
    return { success: true, data }
  } catch (error) {
    console.error("Error creando producto:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

export async function actualizarProducto(id: number, formData: FormData) {
  const supabase = createServerSupabaseClient()

  try {
    const precio = Number.parseInt(formData.get("precio") as string)
    const precio_anterior = formData.get("precio_anterior")
      ? Number.parseInt(formData.get("precio_anterior") as string)
      : null
    const stock = Number.parseInt(formData.get("stock") as string)
    const categoria_id = Number.parseInt(formData.get("categoria_id") as string)

    // Calcular descuento automáticamente si hay precio anterior
    let descuento = null
    if (precio_anterior && precio_anterior > precio) {
      descuento = Math.round(((precio_anterior - precio) / precio_anterior) * 100)
    }

    const { data, error } = await supabase
      .from("productos")
      .update({
        nombre: formData.get("nombre") as string,
        descripcion: formData.get("descripcion") as string,
        precio,
        precio_anterior,
        descuento,
        stock,
        categoria_id,
        imagen_url: (formData.get("imagen_url") as string) || "/placeholder.svg",
        destacado: formData.get("destacado") === "true",
        nuevo: formData.get("nuevo") === "true",
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/productos")
    revalidatePath(`/productos/${id}`)
    return { success: true, data }
  } catch (error) {
    console.error("Error actualizando producto:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

export async function eliminarProducto(id: number) {
  const supabase = createServerSupabaseClient()

  try {
    // Verificar si el producto tiene pedidos asociados
    const { data: pedidos, error: pedidosError } = await supabase
      .from("detalles_pedido")
      .select("id")
      .eq("producto_id", id)
      .limit(1)

    if (pedidosError) {
      return { success: false, error: "Error verificando pedidos asociados" }
    }

    if (pedidos && pedidos.length > 0) {
      return {
        success: false,
        error: "No se puede eliminar el producto porque tiene pedidos asociados",
      }
    }

    // Eliminar reseñas del producto
    await supabase.from("resenas").delete().eq("producto_id", id)

    // Eliminar de carritos
    await supabase.from("carrito").delete().eq("producto_id", id)

    // Eliminar de favoritos
    await supabase.from("favoritos").delete().eq("producto_id", id)

    // Eliminar el producto
    const { error } = await supabase.from("productos").delete().eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/productos")
    return { success: true }
  } catch (error) {
    console.error("Error eliminando producto:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

export async function duplicarProducto(id: number) {
  const supabase = createServerSupabaseClient()

  try {
    // Obtener el producto original
    const { data: producto, error: fetchError } = await supabase.from("productos").select("*").eq("id", id).single()

    if (fetchError || !producto) {
      return { success: false, error: "Producto no encontrado" }
    }

    // Crear copia del producto
    const { data, error } = await supabase
      .from("productos")
      .insert({
        nombre: `${producto.nombre} (Copia)`,
        descripcion: producto.descripcion,
        precio: producto.precio,
        precio_anterior: producto.precio_anterior,
        descuento: producto.descuento,
        stock: 0, // Empezar con stock 0 para la copia
        categoria_id: producto.categoria_id,
        imagen_url: producto.imagen_url,
        destacado: false, // No destacar la copia automáticamente
        nuevo: false, // No marcar como nuevo automáticamente
      })
      .select()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/productos")
    return { success: true, data }
  } catch (error) {
    console.error("Error duplicando producto:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}

export async function cambiarEstadoProducto(id: number, campo: string, valor: boolean) {
  const supabase = createServerSupabaseClient()

  try {
    const updateData: any = {}
    updateData[campo] = valor
    updateData.updated_at = new Date().toISOString()

    const { error } = await supabase.from("productos").update(updateData).eq("id", id)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/productos")
    revalidatePath(`/productos/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Error cambiando estado del producto:", error)
    return { success: false, error: "Error interno del servidor" }
  }
}
