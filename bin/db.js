const db = require("../models");

exports.connect = async () => {
    try {
        await db.mongoose.connect(db.url).then(
            () => {
                console.log(
                    `Connect to MongoDB. Database V: ${
                        db.mongoose.version
                    } model: ${db.mongoose.modelNames()}`
                );
            },
            (err) => {
                console.log("Cannot connect to the database!", err);
                process.exit();
            }
        );
    } catch (error) {
        console.log("Something went wrong: ", error);
    }
};
