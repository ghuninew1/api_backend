import createError from "../utils/createError.js";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export function authMid(req, res, next) {
    try {
        const authHeader =
            req.headers["authorization"] || req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];
        if (token == null)
            return next(createError(401, "Unauthorized! Access Denied!"));

        jwt.verify(token, secret, (err, user) => {
            if (err) return next(createError(403, "Forbidden! Access Denied!"));
            req.user = user;
            next();
        });
    } catch (err) {
        next(err);
    }
}
