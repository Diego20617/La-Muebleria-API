import mongoose from 'mongoose';

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del producto es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [100, "El nombre no puede exceder los 100 caracteres"],
    },
    precio: {
      type: Number,
      required: [true, "El precio es obligatorio"],
      min: [0, "El precio no puede ser negativo"],
    },
    descripcion: {
      type: String,
      maxlength: [500, "La descripción no puede exceder los 500 caracteres"],
    },
    tipo_producto_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TipoProducto",
      required: [true, "El tipo de producto es obligatorio"],
    },
  },
  {
    timestamps: true, // Agrega automáticamente createdAt y updatedAt
    versionKey: false, // Elimina __v de los documentos
  }
);

export default mongoose.model("producto", productoSchema);
