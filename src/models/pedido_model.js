import mongoose from "mongoose";

const pedido_model = mongoose.Schema({
    cant_productos : {
        type : String,
        required: true,
    },
    id_direccion: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "direccion",
        },
      ],
}); 

export default mongoose.model("pedido",pedido_model);