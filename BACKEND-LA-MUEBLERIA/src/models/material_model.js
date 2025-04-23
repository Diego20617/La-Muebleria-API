import mongoose from "mongoose";

const materialSchema = mongoose.Schema({
    material: {
        type: String,
        required: true,
        maxlength: 45,
    },
});

export default mongoose.model("material", materialSchema);