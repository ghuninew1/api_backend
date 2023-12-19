import allowedOrigins from "./allowedOrigins.js";

const corsOptions = {
    origin: allowedOrigins,
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};

export default corsOptions;
