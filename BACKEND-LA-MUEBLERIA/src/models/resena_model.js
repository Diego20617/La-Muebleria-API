import mongoose from "mongoose";

const resenaSchema = mongoose.Schema({
    resena: {
        type: String,
        required: true,
        maxlength: 45,
    },
    id_producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "producto", // Refiere al modelo de producto
        required: true,
    },
});

export default mongoose.model("resena", resenaSchema);
