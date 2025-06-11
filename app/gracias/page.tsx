import React from "react";
import Link from "next/link";

export default function GraciasPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full overflow-hidden">
        <div className="bg-[#4f46e5] p-8 text-center">
          <h1 className="text-3xl font-bold text-white">Mueblería San Bernardo</h1>
        </div>
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">¡Correo confirmado exitosamente!</h2>
          <p className="mb-6 text-gray-700">
            Gracias por confirmar tu correo electrónico. Ya puedes comenzar a explorar nuestra colección de muebles y disfrutar de todos los beneficios de ser parte de nuestra comunidad.
          </p>
          <Link href="/" legacyBehavior>
            <a className="inline-block bg-[#4f46e5] hover:bg-[#4338ca] text-white font-semibold px-6 py-3 rounded-lg transition-colors w-full sm:w-auto">Ir al inicio</a>
          </Link>
        </div>
      </div>
    </div>
  );
} 