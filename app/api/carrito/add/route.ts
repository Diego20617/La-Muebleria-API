import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  console.log("🛒 API Agregar al Carrito: Iniciando...")

  try {
    const body = await request.json()
    const { productoId: producto_id, cantidad = 1 } = body

    console.log("📦 Datos recibidos:", { producto_id, cantidad })

    if (!producto_id || cantidad <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Datos inválidos",
        },
        { status: 400 },
      )
    }

    const supabase = createServerSupabaseClient()

    // Obtener información del producto
    const { data: producto, error: productoError } = await supabase
      .from("productos")
      .select("*")
      .eq("id", producto_id)
      .single()

    if (productoError || !producto) {
      return NextResponse.json({ success: false, error: "Producto no encontrado" }, { status: 404 })
    }

    // Verificar stock
    if (producto.stock < cantidad) {
      return NextResponse.json({ success: false, error: "Stock insuficiente" }, { status: 400 })
    }

    // 1. Siempre guardar en cookies primero (funciona sin BD)
    const carritoStr = cookies().get("carrito")?.value
    const carritoItems: any[] = carritoStr ? JSON.parse(carritoStr) : []

    // Verificar si el producto ya está en el carrito
    const itemExistenteIndex = carritoItems.findIndex((item) => item.producto_id === producto_id)

    if (itemExistenteIndex >= 0) {
      // Verificar que la nueva cantidad no exceda el stock
      const nuevaCantidad = carritoItems[itemExistenteIndex].cantidad + cantidad
      if (nuevaCantidad > producto.stock) {
        return NextResponse.json(
          {
            success: false,
            error: `Solo puedes agregar ${producto.stock - carritoItems[itemExistenteIndex].cantidad} unidades más`,
          },
          { status: 400 },
        )
      }
      carritoItems[itemExistenteIndex].cantidad = nuevaCantidad
    } else {
      // Agregar nuevo item
      carritoItems.push({
        producto_id,
        cantidad,
        producto: {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen_url: producto.imagen_url,
          stock: producto.stock,
        },
      })
    }

    // Guardar en cookies
    cookies().set("carrito", JSON.stringify(carritoItems), {
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
      sameSite: "lax",
    })

    console.log("✅ Guardado en cookies exitosamente")

    // 2. Intentar guardar en BD si es posible
    try {
      const { data } = await supabase.auth.getSession()
      const session = data.session

      if (session?.user) {
        console.log("👤 Usuario autenticado, guardando en BD:", session.user.id)

        // Verificar si ya existe el producto en el carrito
        const { data: existente } = await supabase
          .from("carrito")
          .select("cantidad")
          .eq("usuario_id", session.user.id)
          .eq("producto_id", producto_id)
          .single()

        if (existente) {
          // Verificar que la nueva cantidad no exceda el stock
          const nuevaCantidad = existente.cantidad + cantidad
          if (nuevaCantidad > producto.stock) {
            return NextResponse.json(
              {
                success: false,
                error: `Solo puedes agregar ${producto.stock - existente.cantidad} unidades más`,
              },
              { status: 400 },
            )
          }
          // Actualizar cantidad existente
          await supabase
            .from("carrito")
            .update({ cantidad: nuevaCantidad })
            .eq("usuario_id", session.user.id)
            .eq("producto_id", producto_id)
        } else {
          // Insertar nuevo producto
          await supabase.from("carrito").insert({
            usuario_id: session.user.id,
            producto_id,
            cantidad,
          })
        }

        console.log("✅ Guardado en BD exitosamente")
      }
    } catch (dbError) {
      console.log("⚠️ No se pudo guardar en BD:", dbError.message)
      // No fallamos, ya guardamos en cookies
    }

    return NextResponse.json({
      success: true,
      message: "Producto agregado al carrito",
      items: carritoItems,
      count: carritoItems.length,
    })
  } catch (error) {
    console.error("❌ Error general:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}
