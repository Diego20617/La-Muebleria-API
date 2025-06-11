import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ profile: null, error: "No authenticated user" })
    }

    // Consulta directa sin RLS
    const { data: profile, error } = await supabase.from("perfiles").select("*").eq("id", user.id).single()

    if (error) {
      console.error("Error fetching user profile:", error)

      // Si no existe el perfil, crear uno básico
      const { data: newProfile, error: insertError } = await supabase
        .from("perfiles")
        .insert({
          id: user.id,
          nombre: user.user_metadata?.nombre || "",
          apellido: user.user_metadata?.apellido || "",
          rol: "cliente",
        })
        .select()
        .single()

      if (insertError) {
        console.error("Error creating user profile:", insertError)
        return NextResponse.json({ profile: null, error: insertError.message })
      }

      return NextResponse.json({ profile: newProfile })
    }

    return NextResponse.json({ profile })
  } catch (error) {
    console.error("Error in user-profile API:", error)
    return NextResponse.json({ profile: null, error: "Internal server error" })
  }
}

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "No authenticated user" }, { status: 401 });
    }

    const body = await req.json();
    const { nombre, apellido, telefono, direccion } = body;

    const { error } = await supabase
      .from("perfiles")
      .update({ nombre, apellido, telefono, direccion })
      .eq("id", user.id);

    if (error) {
      console.error("Error actualizando perfil:", error);
      return NextResponse.json({ error: "Error guardando datos del perfil" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error en POST user-profile API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
