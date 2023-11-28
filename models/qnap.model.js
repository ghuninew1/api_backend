import mongoose from "mongoose";

const qnapSchema = new mongoose.Schema(
    {
        authSid: String,
        username: String,
        groupname: String,
        ts: String,
        suid: String,
        cuid: String,
        function_support: String,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("qnap", qnapSchema, "qnap");
