import mongoose from "mongoose";
import { connectDBs } from "#models/index.js";

const UserlineSchema = new mongoose.Schema(
    {
        username: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
        lineId: {
            type: String,
        },
        aud: {
            type: String,
        },
        exp: {
            type: Number,
        },
        iat: {
            type: Number,
        },
        iss: {
            type: String,
        },
        roles: {
            type: Number,
            default: 100,
        },
        token: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
        expires: {
            type: Date,
        },
        img: {
            type: String,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const { userDB } = connectDBs();
// export default mongoose.model("userline", UserlineSchema);
export default userDB.model("userline", UserlineSchema);
