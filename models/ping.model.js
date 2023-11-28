import mongoose from "mongoose";

const pingSchema = new mongoose.Schema(
    {
        ip: String,
        res: Number,
        createdAt: { type: Date, default: Date.now },
        metadata: {
            max: Number,
            min: Number,
            avg: Number,
            host: String,
        },
    },
    {
        timeseries: {
            timeField: "createdAt",
            metaField: "metadata",
            granularity: "hours",
        },
        versionKey: false,
        timestamps: false,
    }
);

export default mongoose.model("ping", pingSchema, "ping");
