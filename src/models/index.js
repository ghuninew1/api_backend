import mongoose from "mongoose";
import { readdirSync } from "node:fs";

const pathDb = `${process.cwd()}/src/models`;
const db = {};

db.mongoose = mongoose;
// const dbModel = readdirSync(pathDb).filter(
//     (f) => f !== "index.js" && f.endsWith(".js")
// );

// import models
// const importModel = dbModel.map(
//     async (model) => await import(`${pathDb}/${model}`)
// );

// connect to db
// db.connect = async function () {
//     try {
//         await mongoose.connect(process.env.MONGODB_URI);
//         console.log(
//             `Connected to MongoDB. V.${mongoose.version}`,
//             mongoose.connection.name
//         );
//     } catch (error) {
//         throw console.log("Error connecting to MongoDB", error);
//     }
// };

const connectDBs = () => {
    try {
        const userDB = mongoose.createConnection(process.env.MONGODB_URI);
        const deadlineDB = mongoose.createConnection(process.env.MONGODB_URI3);
        return { userDB, deadlineDB };
    } catch (error) {
        console.error(`Error:${error.message}`);
        process.exit(1);
    }
};

// import models
// Promise.all(importModel)
//     .then(function (modules) {
//         return modules.forEach(async function (module) {
//             const modelName = await module.default.modelName;
//             db[modelName] = module.default;
//             db[modelName].modelName = modelName;
//         });
//     })
//     .catch((err) => {
//         console.log(err);
//     });

// get db
// db.db = () => mongoose.connection.db;

// // get collection
// db.collection = (name) => mongoose.connection.db.collection(name);

// // list all collections
// db.collectionNames = async () =>
//     await mongoose.connection.db.listCollections().toArray();

// connect to db

// export db
export { connectDBs };
export default db;
