const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("node:fs");
const morgan = require("morgan");
const session = require("express-session");
const db = require("./models");
require("dotenv").config();

const app = express();
app.disable("x-powered-by");

// view engine setup
app.set("views", "./public");
app.set("view engine", "html");
app.set("trust proxy", true);

// middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("./public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: true,
            httpOnly: true,
            expires: new Date(Date.now() + 60 * 60 * 1000),
        },
    })
);
app.use((req, res, next) => {
    if (!req.session.views) {
        req.session.views = {};
    }
    const pathname = req.originalUrl || req.url;
    req.session.views[pathname] = (req.session.views[pathname] || 0) + 1;

    next();
});

// logger
app.use(morgan("dev"));
// app.use(
//     morgan("short", {
//         stream: fs.createWriteStream("./access.log", { flags: "a" }),
//     })
// );

app.use((req, res, next) => {
    res.setHeader("X-Powered-By", "GhuniNew");
    next();
});

// Routes
fs.readdirSync("./routes")
    .filter((f) => f.endsWith(".js"))
    .map((r) => app.use("/", require("./routes/" + r)));

// error handler
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong";
    return res.status(errorStatus).json({
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    });
});

app.listen(process.env.PORT || 8800, () => {
    db.connect();
    console.log(
        `Server is running http://localhost:${process.env.PORT || 8800}`
    );
});

module.exports = app;
