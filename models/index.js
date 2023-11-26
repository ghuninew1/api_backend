const mongoose = require("mongoose");
require("dotenv").config();
const { readdirSync } = require("node:fs");

// mongoose configuration
mongoose.Promise = global.Promise;
let db = {};
db.mongoose = mongoose;

// name of the database
let name = readdirSync("./models")
    .filter((file) => file.slice(-8) === "model.js" && file !== "index.js")
    .map((f) => f.slice(0, -9));

// import all models
name.forEach((n) => {
    db[n] = require(`./${n}.model`);
});

// db object
db.names = name;
db.url = process.env.MONGODB_URI;
db.connect = async () => {
    try {
        await mongoose.connect(db.url);
        console.log(
            "Connected to mongoDB. V." + db.mongoose.version,
            db.mongoose.connection.name
        );
    } catch (error) {
        throw error;
    }
};

// export the database
module.exports = db;
