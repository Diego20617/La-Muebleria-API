import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    color_product : {
        type : String,
        required: true,
    }

});

export default mongoose.model("user",userSchema);