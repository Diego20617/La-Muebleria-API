import { sendMail } from "@/lib/email/sendMail";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { to, subject, text, html } = await req.json();

    if (!to || !subject) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const info = await sendMail({ to, subject, text, html });

    return NextResponse.json(
      { message: "Correo enviado correctamente", info },
      { status: 200 }
    );
  } catch (error: any) {
    // Mostrar el error real en consola y en la respuesta
    console.error("Error al enviar correo:", error, error?.response);
    return NextResponse.json(
      { error: error?.message || "Error al enviar el correo", details: error?.response },
      { status: 500 }
    );
  }
} 