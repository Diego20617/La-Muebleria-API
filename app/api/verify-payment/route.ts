import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "ID de sesión no proporcionado" },
        { status: 400 }
      );
    }

    // Verificar la sesión de pago
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verificar si el pago fue exitoso
    const isValid = session.payment_status === "paid";

    return NextResponse.json({ isValid });
  } catch (error) {
    console.error("Error al verificar el pago:", error);
    return NextResponse.json(
      { error: "Error al verificar el pago" },
      { status: 500 }
    );
  }
} 