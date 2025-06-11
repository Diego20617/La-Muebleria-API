"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import Link from "next/link";

export default function PagoExitosoPage() {
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const sessionId = searchParams.get("session_id");
        if (!sessionId) {
          setIsValid(false);
          return;
        }

        const response = await fetch(`/api/verify-payment?session_id=${sessionId}`);
        const data = await response.json();

        setIsValid(data.isValid);
      } catch (error) {
        console.error("Error al verificar el pago:", error);
        setIsValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams]);

  if (isVerifying) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardContent className="p-6 text-center">
            <p>Verificando el pago...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="container max-w-2xl py-12">
        <Card>
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error en el pago</h1>
            <p className="mb-6">No pudimos verificar tu pago. Por favor, contacta a soporte.</p>
            <Button asChild>
              <Link href="/carrito">Volver al carrito</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl">¡Pago Exitoso!</CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <p className="mb-6">
            Gracias por tu compra. Hemos recibido tu pago correctamente y procesaremos tu pedido lo antes posible.
          </p>
          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/">Volver a la tienda</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/pedidos">Ver mis pedidos</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 