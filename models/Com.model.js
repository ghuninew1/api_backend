import mongoose from "mongoose";

const ComSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        user: String,
        ip: {
            type: String,
            required: true,
        },
        cpu: {
            type: String,
        },
        ram: {
            type: String,
        },
        hdd: {
            type: Array,
        },
        gpu: {
            type: String,
        },
        os: {
            type: String,
        },
        ups: {
            type: String,
        },
        licMaya: {
            type: Boolean,
        },
        program: {
            type: Array,
        },
        subscribes: {
            type: String,
        },
        img: {
            type: String,
        },
        status: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("com", ComSchema);
