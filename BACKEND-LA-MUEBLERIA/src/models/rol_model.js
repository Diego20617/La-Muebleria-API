import mongoose from "mongoose";

const rol_model = mongoose.Schema({
    rol: {
        type: String,
        required: true,
    },
    id_estado: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "estado",
        },
      ],
});

export default mongoose.model("rol", rol_model);