import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
    },
    category: {
      type: String,
      required: false, // Cambiado a false porque el código React Native no lo requiere obligatorio
    },
    price: {
      type: String, // Cambiado a String para coincidir con el código React Native
      required: [true, "El precio es obligatorio"],
    },
    stock: {
      type: String, // Cambiado a String para coincidir con el código React Native
      required: false, // No es obligatorio en el código React Native
    },
    description: {
      type: String,
      maxlength: [500, "La descripción no puede exceder los 500 caracteres"],
    },
    color: {
      type: String, // Añadido para coincidir con el código React Native
      required: false,
    },
    dimensions: {
      height: { type: String, required: false }, // Añadido para coincidir con el código React Native
      width: { type: String, required: false },  // Añadido para coincidir con el código React Native
      depth: { type: String, required: false },  // Añadido para coincidir con el código React Native
    },
    imageUrl: {
      type: String, // Añadido para coincidir con el código React Native
      required: false,
    },
    tipo_producto_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "tipo_producto",
      required: false, // Opcional, dependiendo si necesitas relacionarlo
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Producto", productoSchema);


