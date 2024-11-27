import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    nombre : {
        type : String,
        required: true,
    },
    Edad: {
        type: Number,
        required: true,
    },
    genero: {
        type: String,
        required: true,
    },
});

export default mongoose.model("user",userSchema);