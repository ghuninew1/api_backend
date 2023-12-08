import mongoose from "mongoose";
import { readdirSync } from "node:fs";

const pathDb = process.cwd() + "/models";
const db = {};

const dbModel = readdirSync(pathDb).filter(
    (f) => f !== "index.js" && f.endsWith(".js")
);
const dbModelName = dbModel.map((r) => r.split(".")[0]);

const importModel = dbModel.map(
    async (model) => await import(`${pathDb}/${model}`)
);

db.mongoose = mongoose;

db.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(
            `Connected to MongoDB. V.${mongoose.version}`,
            mongoose.connection.name
        );
    } catch (error) {
        throw console.log("Error connecting to MongoDB", error);
    }
};

Promise.all(importModel)
    .then((modules) => {
        return modules.forEach(async (module) => {
            const modelName = await module.default.modelName;
            db[modelName] = module.default;
            db[modelName].modelName = modelName;
        });
    })
    .catch((err) => {
        console.log(err);
    });

db.url = process.env.MONGODB_URI;

db.db = () => mongoose.connection.db;

db.collection = (name) => mongoose.connection.db.collection(name);

db.collectionNames = async () =>
    await mongoose.connection.db.listCollections().toArray();

export default db;
