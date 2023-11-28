import Users from "../models/users.model.js";
import bcrypt from "bcryptjs";
import { useDecode, useSign, createError } from "../utils/index.js";

const secret = process.env.JWT_SECRET;
const option = { expiresIn: "10h" };

export const register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return next(createError(400, "Please enter all fields"));
        }

        const user = await Users.findOne({ username });

        if (user) {
            return next(createError(400, "User already exists"));
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const newUser = new Users({
            ...req.body,
            password: hash,
        });
        await newUser.save();

        res.status(201).json({ msg: "User created" });
    } catch (err) {
        next(err);
    }
};

export const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return next(createError(400, "Please enter all fields"));
        }

        const user = await Users.findOneAndUpdate({ username }, { new: true });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return next(createError(400, "Invalid Credentials"));
            }

            let payload = {
                username: user.username,
                isAdmin: user.isAdmin,
            };

            if (user.tokens?.length < 1) {
                useSign(payload, secret, option).then(async (token) => {
                    user.tokens = [];
                    user.tokens = user.tokens.concat({
                        token,
                        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
                    });
                    await user.save();
                    user.password = undefined;

                    return res.status(200).json(user);
                });
            } else {
                const tokens = user.tokens[0];
                if (Date.now() > tokens.expires) {
                    user.tokens = [];
                    await user.save();
                    useSign(payload, secret, option).then(async (token) => {
                        user.tokens = user.tokens.concat({
                            token,
                            expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
                        });
                        await user.save();
                        user.password = undefined;

                        return res.status(200).json(user);
                    });
                } else {
                    user.password = undefined;

                    return res.status(200).json(user);
                }
            }
        }
    } catch (err) {
        next(err);
    }
};

export const currentUser = (req, res, next) => {
    try {
        const token = req.headers["authtoken"];

        if (!token) {
            return next(createError(403, "Unauthorized!"));
        }

        const decoded = useDecode(token);

        req.session.user = decoded;

        return res.status(200).json({
            session: req.session,
        });
    } catch (err) {
        next(err);
    }
};
