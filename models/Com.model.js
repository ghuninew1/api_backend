import mongoose from "mongoose";

const ComSchema = new mongoose.Schema(
    {
        name: {
            type: String,
        },
        user: {
            type: String,
        },

        ip: {
            type: String,
        },
        cpu: {
            type: String,
        },
        ram: {
            type: String,
        },
        hdd: {
            type: String,
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
            type: String,
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

const Com = mongoose.model("Com", ComSchema);

export default Com;
