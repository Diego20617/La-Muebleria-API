import mongoose from "mongoose";
import bcrypt from 'mongoose-bcrypt';

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
        type: Number, // Mantiene type Number
        required: true,
    },
    contraseña: {
        type: String,
        required: true,
        bcrypt: true,
    },
    id_rol: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "rol",
        },
    ],
});

usuario_model.plugin(bcrypt);
export default mongoose.model("usuario", usuario_model);
