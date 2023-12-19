import User from "#models/Userline.model.js";

// import db from "#models/index.js";
import bcrypt from "bcryptjs";
import createError from "#utils/createError.js";
import jwt from "jsonwebtoken";

const refreshSecret = process.env.JWT_REFRESH_TOKEN;

const authLine = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data) return next(createError(400, "Please enter all fields"));
        db.connect();
        const foundUser = await User.findOneAndUpdate(
            { lineId: data.lineId },
            { new: true }
        );

        if (!foundUser) {
            const payload = {
                username: data.name,
                roles: 100,
            };
            // create JWTs
            const newRefreshToken = jwt.sign(payload, refreshSecret, {
                expiresIn: "1d",
            });

            //create and store the new user

            const newUser = new User({
                username: data.name,
                lineId: data.lineId,
                aud: data.aud,
                exp: data.exp,
                iat: data.iat,
                iss: data.iss,
                img: data.picture,
                expires: Date.now() + 24 * 60 * 60 * 1000, // 1 day
                refreshToken: newRefreshToken,
                roles: 100,
            });

            await newUser.save();

            // Creates Secure Cookie with refresh token
            res.cookie("jwt", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 24 * 60 * 60 * 1000, // 1 day
            })
                .status(201)
                .json({
                    username: foundUser.username,
                    roles: foundUser.roles,
                    img: foundUser.img,
                    expires: foundUser.expires,
                });
        } else {
            // evaluate password
            const decoded = jwt.verify(foundUser.refreshToken, refreshSecret);

            if (decoded.exp < Date.now() / 1000) {
                foundUser.refreshToken = undefined;
                await foundUser.save();

                const payload = {
                    username: foundUser.username,
                    roles: foundUser.roles,
                };

                const newRefreshToken = jwt.sign(payload, refreshSecret, {
                    expiresIn: "1d",
                });

                foundUser.refreshToken = newRefreshToken;
                foundUser.expires = Date.now() + 24 * 60 * 60 * 1000;

                await foundUser.save();

                res.cookie("jwt", newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                })
                    .status(201)
                    .json({
                        username: foundUser.username,
                        roles: foundUser.roles,
                        img: foundUser.img,
                        expires: foundUser.expires,
                    });
            } else {
                res.cookie("jwt", foundUser.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                })
                    .status(201)
                    .json({
                        username: foundUser.username,
                        roles: foundUser.roles,
                        img: foundUser.img,
                        expires: foundUser.expires,
                    });
            }
        }
    } catch (err) {
        next(err);
    }
};

export default authLine;
