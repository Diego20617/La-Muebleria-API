import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    tip_product : {
        type : String,
        required: true,
    }
});

export default mongoose.model("user",userSchema);