import { type NextRequest, NextResponse } from "next/server"

// Función simple para obtener carrito de cookies
function getCartFromCookies(request: NextRequest) {
  try {
    const cartCookie = request.cookies.get("carrito")?.value
    if (!cartCookie) return []

    const cartItems = JSON.parse(decodeURIComponent(cartCookie))
    return Array.isArray(cartItems) ? cartItems : []
  } catch (error) {
    console.error("Error parsing cart cookie:", error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("🛒 API Carrito: Iniciando...")

    // Obtener carrito de cookies
    const carritoItems = getCartFromCookies(request)
    console.log("🍪 Carrito en cookies:", carritoItems.length, "items")

    return NextResponse.json({
      success: true,
      items: carritoItems,
      count: carritoItems.length,
      source: "cookies",
    })
  } catch (error) {
    console.error("❌ Error general en API carrito:", error)
    return NextResponse.json({
      success: true,
      items: [],
      count: 0,
      source: "error",
    })
  }
}
