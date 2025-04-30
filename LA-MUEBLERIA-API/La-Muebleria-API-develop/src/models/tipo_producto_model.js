import mongoose from "mongoose";

const tipoProductoSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        maxlength: 50, // Limite de caracteres para el nombre del tipo de producto
    },
    descripcion: {
        type: String,
        required: true,
        maxlength: 200, // Limite de caracteres para la descripción del tipo de producto
    },
});

export default mongoose.model("tipo_producto", tipoProductoSchema);
