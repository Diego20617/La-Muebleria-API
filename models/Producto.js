import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    producto : {
        type : String,
        required: true,
    },
    dimenciones : {
        type : String,
        required: true,
    }

});

export default mongoose.model("user",userSchema);