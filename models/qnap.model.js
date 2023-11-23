const mongoose = require("mongoose");

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

module.exports = mongoose.model("qnap", qnapSchema, "qnap");
