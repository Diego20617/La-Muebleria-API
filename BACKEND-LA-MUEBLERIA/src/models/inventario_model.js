import mongoose from "mongoose";

const inventarioSchema = mongoose.Schema({
    cantidad: {
        type: String,
        required: true,
        maxlength: 45,
    },
    id_producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "producto", // Relación con la colección "producto"
        required: true,
    },
    id_material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "material", // Relación con la colección "material"
        required: true,
    },
});

export default mongoose.model("inventario", inventarioSchema);
