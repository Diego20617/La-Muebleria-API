"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Verificar que la clave pública esté disponible
if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY no está definida");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  imagen_url: string;
  descripcion?: string;
  cantidad?: number;
}

interface StripePaymentButtonProps {
  amount: number;
  description: string;
  items?: Producto[];
  orderId?: string;
  userId?: string;
  onSuccess?: () => void;
  className?: string;
}

export function StripePaymentButton({
  amount,
  description,
  items,
  orderId,
  userId,
  onSuccess,
  className = "",
}: StripePaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Verificar que Stripe esté disponible
  useEffect(() => {
    const checkStripe = async () => {
      const stripe = await stripePromise;
      if (!stripe) {
        console.error("Stripe no se pudo inicializar");
        toast({
          title: "Error",
          description: "No se pudo inicializar el sistema de pagos",
          variant: "destructive",
        });
      }
    };
    checkStripe();
  }, [toast]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Asegurarse de que los precios sean números enteros
      const processedItems = items?.map(item => ({
        ...item,
        precio: Math.round(item.precio),
        cantidad: Math.max(1, item.cantidad || 1)
      }));

      // Crear la sesión de pago
      const response = await fetch("/api/create-payment-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(amount),
          description,
          items: processedItems,
          orderId: orderId || `ORDER-${Date.now()}`,
          userId
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al crear la sesión de pago");
      }

      const { sessionId } = await response.json();

      // Redirigir a la página de pago de Stripe
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe no está disponible");

      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        throw error;
      }

      onSuccess?.();
    } catch (error: any) {
      console.error("Error en el pago:", error);
      toast({
        title: "Error",
        description: error.message || "Hubo un problema al procesar el pago. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePayment}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Procesando...
        </>
      ) : (
        "Pagar ahora"
      )}
    </Button>
  );
} 