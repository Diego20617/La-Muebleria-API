import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    estado : {
        type : String,
        required: true,
    }
});

export default mongoose.model("user",userSchema);