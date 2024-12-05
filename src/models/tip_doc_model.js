import mongoose from "mongoose";

const tip_doc_model = mongoose.Schema({
    tip_doc : {
        type : String,
        required: true,
    },
    id_usuario: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "usuario",
        },
      ],
});

export default mongoose.model("tip_doc",tip_doc_model);