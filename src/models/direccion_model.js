import mongoose from "mongoose";

const direccion_model = mongoose.Schema({
    direccion : {
        type : String,
        required: true,
    }
});

export default mongoose.model("direccion",direccion_model);