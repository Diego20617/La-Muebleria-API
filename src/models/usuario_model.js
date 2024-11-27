import mongoose from "mongoose";

const usuario_model = mongoose.Schema({
    nombres: {
        type: String,
        required: true,
    },
    apellidos: {
        type: String,
        required: true,
    },
    correo: {
        type: String,
        required: true,
    },
    num_doc: {
        type: Number,
        required: true,
    },
    contraseña: {
        type: String,
        required: true,
    },
});

export default mongoose.model("usuario", usuario_model);