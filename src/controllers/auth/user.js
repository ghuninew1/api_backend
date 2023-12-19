import createError from "#utils/createError.js";
import jwt from "jsonwebtoken";
import User from "#models/Userline.model.js";

const refreshSecret = process.env.JWT_REFRESH_TOKEN;

export const getUser = async (req, res, next) => {
    try {
        const cookie = req.cookies["jwt"];
        if (!cookie) {
            return next(createError(401, "Access denied No accessToken Token"));
        }

        const userCheck = jwt.verify(cookie, refreshSecret);

        if (userCheck.exp < Date.now() / 1000) {
            return next(createError(401, "Access denied Token Expired"));
        } else {
            const dbUsers = await User.findOne({
                username: userCheck.username,
            }).select("-password");

            return res.status(200).json(dbUsers);
        }
    } catch (err) {
        next(err);
    }
};
