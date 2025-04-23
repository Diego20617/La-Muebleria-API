import mongoose from "mongoose";

const usuarioConProducto_model = mongoose.Schema({
    id_usuario: [
        {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "usuario",
        },
    ],
    id_producto: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "producto",
        },
    ],
});

export default mongoose.model("usuario-con-producto", usuarioConProducto_model);