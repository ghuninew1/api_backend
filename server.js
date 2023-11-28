import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import session from "express-session";
import { connect } from "./models/index.js";
import rootRoute from "./routes/root.js";
import apiRoute from "./routes/api.js";
import authRoute from "./routes/auth.js";
import utilsRoute from "./routes/utils.js";
import pingRoute from "./routes/ping.js";

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
        saveUninitialized: true,
    })
);

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
// fs.readdirSync("./routes")
//     .filter((f) => f.endsWith(".js"))
//     .map((r) => app.use("/", require("./routes/" + r)));
app.use("/", rootRoute, apiRoute, authRoute, utilsRoute, pingRoute);

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
    connect();
    console.log(
        `Server is running http://localhost:${process.env.PORT || 8800}`
    );
});

export default app;
