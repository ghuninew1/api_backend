import mongoose from "mongoose";
// import fs from "node:fs";

// mongoose configuration
// mongoose.Promise = global.Promise;

// // name of the database
// const modelsDir = "./models";
// const modelFiles = fs
//     .readdirSync(modelsDir)
//     .filter((file) => file.endsWith("model.js"));
// const names = modelFiles.map((file) => file.slice(0, -9));

// // import all models
// const db = {};
// names.forEach(async (n) => {
//     db[n] = await import(`./${n}.model`);
// });

// // db object
// db.names = names;

// connect to MongoDB
export async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log(
            `Connected to MongoDB. V.${mongoose.version}`,
            mongoose.connection.name
        );
    } catch (error) {
        throw error;
    }
}
export default connect;

// export { default as visit } from "./visit.model.js";
// export { default as users } from "./users.model.js";
// export { default as ping } from "./ping.model.js";
// export { default as qnap } from "./qnap.model.js";
// export { default as files } from "./files.model.js";

// export default db = {
//     visit,
//     users,
//     ping,
//     qnap,
//     files,
// };
