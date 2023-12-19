import mongoose from "mongoose";
import { connectDBs } from "#models/index.js";

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

const { userDB } = connectDBs();

// const Com = mongoose.model("Com", ComSchema);
const Com = userDB.model("Com", ComSchema);

export default Com;
