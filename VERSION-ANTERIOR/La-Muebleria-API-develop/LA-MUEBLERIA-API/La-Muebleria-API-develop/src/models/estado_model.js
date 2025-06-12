import mongoose from "mongoose";

const estado_model = mongoose.Schema({
    estado : {
        type : String,
        required: true,
    }
});

export default mongoose.model("estado",estado_model);