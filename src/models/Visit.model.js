import mongoose from "mongoose";

const VisitSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },
        counter: {
            type: Number,
            required: true,
        },
        ip: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("visit", VisitSchema);
