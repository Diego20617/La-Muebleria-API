import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    tip_doc : {
        type : String,
        required: true,
    }
});

export default mongoose.model("user",userSchema);