const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("node:fs");
const { handleError } = require("./bin/utils.js");
const morgan = require("morgan");

const app = express();

// view engine setup
app.set("views", "./public");
app.set("view engine", "html");
app.set("trust proxy", true);

// middlewares
app.use(bodyParser.json());
app.use(cors());
app.use(express.static("./public"));

// logger
app.use(morgan("dev"));
app.use((req, res, next) => {
    res.setHeader("X-Powered-By", "GhuniNew");
    next();
});

// Routes
fs.readdirSync("./routes")
    .filter((f) => f.endsWith(".js"))
    .map((r) => app.use("/", require("./routes/" + r)));

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next({ statusCode: 404, message: "Not Found 404" });
});

// error handler
app.use((err, req, res, next) => {
    handleError(err, res);
});

module.exports = app;
