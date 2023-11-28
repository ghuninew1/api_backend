import { createError, verify } from "../utils/index.js";

const secret = process.env.JWT_SECRET;

export const auth = (req, res, next) => {
    try {
        const token = req.headers["authtoken"];
        if (token == null) {
            return next(createError(401, "token is valid!"));
        }

        const decoded = verify(token, secret);
        if (!decoded) {
            return next(createError(403, "Unauthorized!"));
        }

        req.user = decoded;
        req.session.user = decoded;

        next();
    } catch (err) {
        next(err);
    }
};

export const authAdmin = (req, res, next) => {
    try {
        const token = req.headers["authtoken"];
        if (token == null) {
            return next(createError(401, "token is valid!"));
        }

        const decoded = verify(token, secret);
        if (!decoded) {
            return next(createError(403, "Unauthorized!"));
        }

        if (decoded.isAdmin !== true) {
            return next(createError(403, "is not admin!"));
        }

        req.user = decoded;

        next();
    } catch (err) {
        next(err);
    }
};
