// MIDDLEWARE COMPLETAMENTE DESHABILITADO PARA ADMIN
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // PERMITIR TODO EL ACCESO A /admin SIN VERIFICACIONES
  if (request.nextUrl.pathname.startsWith("/admin")) {
    console.log("ADMIN ACCESS ALLOWED - NO RESTRICTIONS")
    return NextResponse.next()
  }

  // Solo proteger otras rutas si es necesario
  return NextResponse.next()
}

export const config = {
  matcher: ["/perfil/:path*", "/pedidos/:path*", "/favoritos/:path*", "/configuracion/:path*", "/checkout/:path*"],
}
