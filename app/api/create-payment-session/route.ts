import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { amount, description, items, userId, orderId } = await req.json();

    if (!amount || !description || !userId) {
      console.error("[API] Faltan campos requeridos", { amount, description, userId });
      return NextResponse.json(
        { error: "Faltan campos requeridos en la solicitud" },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Calcular el total de los items para verificar que coincida con el amount
    const totalItems = items?.reduce((acc: any, item: any) => acc + (Math.round(item.precio) * Math.max(1, item.cantidad || 1)), 0) || 0;
    const totalFinal = Math.round(amount);
    const totalFinalStripe = totalFinal * 100;
    const pedidoId = orderId || `ORDER-${Date.now()}`;

    console.log("[API] Intentando guardar pedido", { pedidoId, userId, totalFinal });
    // Guardar el pedido en la base de datos (sin id, que lo genere la BD)
    const { data: pedido, error: pedidoError } = await supabase
      .from("pedidos")
      .insert({
        usuario_id: userId,
        total: totalFinal,
        estado: "pendiente",
        metodo_pago: "stripe",
        direccion_envio: "",
        ciudad_envio: "",
        region_envio: "",
        codigo_postal_envio: "",
        notas: "",
      })
      .select()
      .single();

    if (pedidoError) {
      console.error("[API] Error al guardar pedido:", pedidoError);
      return NextResponse.json({ error: pedidoError.message }, { status: 500 });
    }
    console.log("[API] Pedido guardado", pedido);

    // Guardar los detalles del pedido
    const detalles = items.map((item: any) => ({
      pedido_id: pedido.id, // Usar el id generado
      producto_id: item.id,
      cantidad: item.cantidad,
      precio_unitario: item.precio,
      subtotal: item.precio * item.cantidad,
    }));

    const { error: detallesError } = await supabase
      .from("detalles_pedido")
      .insert(detalles);

    if (detallesError) {
      console.error("[API] Error al guardar detalles:", detallesError);
      return NextResponse.json({ error: detallesError.message }, { status: 500 });
    }
    console.log("[API] Detalles guardados");

    // Si hay diferencia, usar el totalFinal como un solo item para Stripe
    const line_items = (items && Math.abs(totalItems - totalFinal) < 5)
      ? items.map((item: any) => ({
          price_data: {
            currency: "cop",
            product_data: {
              name: item.nombre || "Producto sin nombre",
              ...(item.descripcion && { description: item.descripcion }),
              images: item.imagen_url && typeof item.imagen_url === 'string' && (item.imagen_url.startsWith('http://') || item.imagen_url.startsWith('https://'))
                ? [item.imagen_url]
                : [],
            },
            unit_amount: Math.round(item.precio) * 100,
          },
          quantity: Math.max(1, item.cantidad || 1),
        }))
      : [
          {
            price_data: {
              currency: "cop",
              product_data: {
                name: description || "Pedido completo",
              },
              unit_amount: totalFinalStripe,
            },
            quantity: 1,
          },
        ];

    // Crear la sesión de pago
    let session;
    try {
      session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/carrito`,
        metadata: {
          orderId: pedido.id, // Usar el id generado
          userId: userId,
          items: JSON.stringify(items?.map((item: any) => ({
            id: item.id,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad
          }))),
          total: totalFinal.toString()
        },
      });
    } catch (stripeError: any) {
      console.error("[API] Error al crear sesión de Stripe:", stripeError);
      return NextResponse.json({ error: stripeError.message }, { status: 500 });
    }

    console.log("[API] Sesión de Stripe creada", session.id);
    return NextResponse.json({ sessionId: session.id });
  } catch (error: any) {
    console.error("[API] Error general:", error);
    return NextResponse.json(
      { error: error.message || "Error desconocido al procesar el pago" },
      { status: 500 }
    );
  }
} 