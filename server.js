import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import session from "express-session";
import createError from "./utils/createError.js";
import {
    rootRoute,
    apiRoute,
    authRoute,
    utilsRoute,
    pingRoute,
    corsOptions,
} from "./routes/index.js";

const app = express();
app.disable("x-powered-by");

// view engine setup
app.set("views", "./public");
app.set("view engine", "html");
app.set("trust proxy", true);

// middlewares
app.use(bodyParser.json());
app.use(cors(corsOptions));
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
app.use("/", rootRoute, authRoute, utilsRoute, pingRoute, apiRoute);

// error handler
app.use((err, req, res, next) => {
    const error = createError(err.status, err.message);
    res.status(error.status).json({
        status: error.status,
        message: error.message,
    });

    next();
});

app.listen(process.env.PORT || 8800, () => {
    console.log(
        `Server is running http://localhost:${process.env.PORT || 8800}`
    );
});
