import createError from "#utils/createError.js";
import jwt from "jsonwebtoken";

const refreshSecret = process.env.JWT_REFRESH_TOKEN;

export const authMid = (req, res, next) => {
    const accessToken = req.cookies["jwt"];

    // const accessToken = token.split(" ")[1];
    if (!accessToken) {
        return next(createError(401, "Access Denied. No token provided."));
    }
    try {
        jwt.verify(accessToken, refreshSecret, (err, decoded) => {
            if (err) {
                return next(createError(401, "Invalid Token"));
            }
            req.user = decoded;
            next();
        });
    } catch (err) {
        next(createError(400, "Invalid Token"));
    }
};

export const authRefresh = (req, res, next) => {
    const refreshToken = req.header("x-refresh-token");

    if (!refreshToken) {
        return next(createError(401, "Access Denied. No token provided."));
    }
    try {
        jwt.verify(refreshToken, refreshSecret, (err, decoded) => {
            if (err) {
                return next(createError(401, "Invalid Token"));
            }
            req.user = decoded;
            next();
        });
    } catch (err) {
        next(createError(400, "Invalid Token"));
    }
};
