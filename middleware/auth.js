const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const { createError } = require("../utils/error");

exports.auth = (req, res, next) => {
    try {
        const token = req.headers["authtoken"];
        if (token == null) return next(createError(403, "Unauthorized!"));

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return next(createError(400, "Token expired!"));
                }
                return next(createError(403, "Unauthorized!"));
            }
            req.user = decoded;
            req.session.user = decoded;
            next();
        });
    } catch (err) {
        next(err);
    }
};

exports.authAdmin = (req, res, next) => {
    try {
        const token = req.headers["authtoken"];
        if (token == null) return next(createError(403, "Unauthorized!"));

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return next(createError(400, "Token expired!"));
                }
                return next(createError(403, "Unauthorized!"));
            }
            if (decoded.isAdmin !== true) {
                return next(createError(403, "is not admin!"));
            }
            req.user = decoded;
            req.session.user = decoded;
            next();
        });
    } catch (err) {
        next(err);
    }
};
