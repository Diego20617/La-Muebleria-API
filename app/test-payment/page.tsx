"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StripePaymentButton } from "@/components/stripe-payment-button";

const productosEjemplo = [
  {
    id: 1,
    nombre: "Sofá Moderno",
    precio: 1500000, // $1.500.000 COP
    imagen_url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc",
    descripcion: "Sofá moderno de 3 plazas en color gris",
    cantidad: 1
  },
  {
    id: 2,
    nombre: "Mesa de Centro",
    precio: 450000, // $450.000 COP
    imagen_url: "https://images.unsplash.com/photo-1532372320572-cda25653a26f",
    descripcion: "Mesa de centro de madera y vidrio",
    cantidad: 1
  }
];

export default function TestPaymentPage() {
  const total = productosEjemplo.reduce((sum, item) => sum + (item.precio * (item.cantidad || 1)), 0);

  return (
    <div className="container max-w-2xl py-12">
      <Card>
        <CardHeader>
          <CardTitle>Prueba de Pago</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {productosEjemplo.map((producto) => (
              <div key={producto.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img
                  src={producto.imagen_url}
                  alt={producto.nombre}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{producto.nombre}</h3>
                  <p className="text-sm text-muted-foreground">{producto.descripcion}</p>
                  <p className="text-lg font-bold">
                    ${producto.precio.toLocaleString('es-CO')} COP
                  </p>
                </div>
                <div className="text-sm">
                  Cantidad: {producto.cantidad}
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total:</span>
                <span className="text-xl font-bold">
                  ${total.toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>
          </div>

          <StripePaymentButton
            amount={total}
            description="Compra en Mueblería San Bernardo"
            items={productosEjemplo}
            orderId="TEST-001"
            className="w-full"
          />

          <div className="text-sm text-muted-foreground mt-4">
            <p className="font-semibold mb-2">Tarjetas de prueba:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Pago exitoso: 4242 4242 4242 4242</li>
              <li>Pago fallido: 4000 0000 0000 0002</li>
              <li>Fecha: Cualquier fecha futura</li>
              <li>CVC: Cualquier número de 3 dígitos</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 