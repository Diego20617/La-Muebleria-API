import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, nombre, apellido } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Use upsert to handle existing profiles gracefully
    const { data, error } = await supabase
      .from("perfiles")
      .upsert(
        {
          id: userId,
          nombre: nombre || "",
          apellido: apellido || "",
          rol: "cliente",
        },
        {
          onConflict: "id",
        },
      )
      .select()

    if (error) {
      console.error("Error upserting profile:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ profile: data[0] })
  } catch (error) {
    console.error("Error in create-profile API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
