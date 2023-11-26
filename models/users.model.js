const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: String,
        password: {
            type: String,
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        tokens: [
            {
                token: String,
                expires: Date,
            },
        ],
        img: {
            type: String,
        },
        isLogged: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

module.exports = mongoose.model("users", usersSchema, "users");
