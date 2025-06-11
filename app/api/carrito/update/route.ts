import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { productoId, cantidad } = await request.json()

    if (!productoId || cantidad < 0) {
      return NextResponse.json({ success: false, error: "Datos inválidos" }, { status: 400 })
    }

    // Obtener carrito actual de cookies
    const carritoData = request.cookies.get("carrito")?.value
    let carritoItems: any[] = carritoData ? JSON.parse(decodeURIComponent(carritoData)) : []

    if (cantidad === 0) {
      // Eliminar producto
      carritoItems = carritoItems.filter((item) => item.producto_id !== productoId)
    } else {
      // Actualizar cantidad
      const itemIndex = carritoItems.findIndex((item) => item.producto_id === productoId)
      if (itemIndex !== -1) {
        carritoItems[itemIndex].cantidad = cantidad
      }
    }

    // Crear respuesta con cookie actualizada
    const response = NextResponse.json({
      success: true,
      message: cantidad === 0 ? "Producto eliminado" : "Cantidad actualizada",
      items: carritoItems,
      count: carritoItems.length,
    })

    // Establecer cookie con el carrito actualizado
    response.cookies.set("carrito", encodeURIComponent(JSON.stringify(carritoItems)), {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 días
      path: "/",
    })

    return response
  } catch (error) {
    console.error("Error en /api/carrito/update:", error)
    return NextResponse.json({ success: false, error: "Error interno del servidor" }, { status: 500 })
  }
}
