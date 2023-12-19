import mongoose from "mongoose";
import { connectDBs } from "#models/index.js";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
        password: {
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
// export default mongoose.model("user", UserSchema);
export default userDB.model("user", UserSchema);
