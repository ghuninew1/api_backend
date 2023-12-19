import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
    {
        name: String,
        alt: String,
        title: String,
        url: String,
        file: String,
        file_size: String,
        file_originalname: String,
        file_path: String,
        file_mimetype: String,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

export default mongoose.model("file", FileSchema);
