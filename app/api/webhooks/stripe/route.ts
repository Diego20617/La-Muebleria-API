import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  console.log("[WEBHOOK] Recibido webhook de Stripe");
  console.log("[WEBHOOK] Firma:", signature);
  console.log("[WEBHOOK] Body:", body);

  if (!signature) {
    console.error("[WEBHOOK] No se proporcionó la firma de Stripe");
    return NextResponse.json(
      { error: "No se proporcionó la firma de Stripe" },
      { status: 400 }
    );
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    console.log("[WEBHOOK] Evento recibido:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      // Usar Supabase Service Key para bypass de RLS
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      // Extraer información de la sesión
      const { orderId, items, total, userId } = session.metadata || {};
      const parsedItems = items ? JSON.parse(items) : [];
      console.log("[WEBHOOK] orderId:", orderId);
      console.log("[WEBHOOK] items:", parsedItems);
      console.log("[WEBHOOK] total:", total);

      // Validar userId
      if (!userId || typeof userId !== "string" || userId.length !== 36) {
        console.error("[WEBHOOK] userId inválido o ausente. No se creará el pedido.", userId);
        return NextResponse.json({ error: "userId inválido o ausente" }, { status: 400 });
      }

      // Crear el pedido en la base de datos
      const { data: pedido, error: pedidoError } = await supabase
        .from("pedidos")
        .insert({
          id: orderId,
          usuario_id: userId,
          total: parseFloat(total),
          estado: "pagado",
          metodo_pago: "stripe",
          fecha_pago: new Date().toISOString(),
          detalles_pago: {
            session_id: session.id,
            payment_intent: session.payment_intent,
          },
          direccion_envio: null,
          ciudad_envio: null,
          region_envio: null,
          codigo_postal_envio: null,
          notas: null,
        })
        .select()
        .single();

      if (pedidoError) {
        console.error("[WEBHOOK] Error al crear el pedido:", pedidoError);
        throw pedidoError;
      }
      console.log("[WEBHOOK] Pedido creado:", pedido);

      // Crear los detalles del pedido
      const detalles = parsedItems.map((item: any) => ({
        pedido_id: pedido.id,
        producto_id: item.id,
        cantidad: item.cantidad,
        precio_unitario: item.precio,
        subtotal: item.precio * item.cantidad,
      }));

      const { error: detallesError } = await supabase
        .from("detalles_pedido")
        .insert(detalles);

      if (detallesError) {
        console.error("[WEBHOOK] Error al crear los detalles del pedido:", detallesError);
        throw detallesError;
      }
      console.log("[WEBHOOK] Detalles del pedido creados");

      // Actualizar el stock de los productos
      for (const item of parsedItems) {
        const { error: stockError } = await supabase.rpc("actualizar_stock", {
          p_producto_id: item.id,
          p_cantidad: item.cantidad,
        });
        if (stockError) {
          console.error("[WEBHOOK] Error al actualizar stock:", stockError);
        }
      }
      console.log("[WEBHOOK] Stock actualizado");

      // Registrar la venta en el historial de ventas
      const { error: ventaError } = await supabase
        .from("ventas_mes")
        .insert({
          fecha: new Date().toISOString(),
          total: parseFloat(total),
          pedido_id: pedido.id,
          detalles: parsedItems
        });

      if (ventaError) {
        console.error("[WEBHOOK] Error al registrar la venta:", ventaError);
        throw ventaError;
      }
      console.log("[WEBHOOK] Venta registrada en ventas_mes");
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("[WEBHOOK] Error en el webhook:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
} 