const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.JWT_SECRET;
const option = { expiresIn: "1d" };
const { createError } = require("../utils/error");

exports.register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email)
            return next(createError(400, "Please enter all fields"));

        const user = await db.users.findOne({ username });

        user && next(createError(400, "User already exists"));

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        user = new db.users({
            ...req.body,
            password: hash,
        });
        await user.save();

        return res.status(201).json({ msg: "User created" });
    } catch (err) {
        next(err);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return next(createError(400, "Please enter all fields"));

        const user = await db.users.findOneAndUpdate(
            { username },
            { new: true }
        );
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return next(createError(400, "Invalid Credentials"));

            let payload = {
                username: user.username,
                isAdmin: user.isAdmin,
            };

            if (user.tokens.length > 0) {
                const token = user.tokens[0];
                if (Date.now() > token.expires) {
                    user.tokens = [];
                    await user.save();
                    jwt.sign(payload, secret, option, async (err, token) => {
                        if (err) return next(createError(500, err));
                        user.tokens = user.tokens.concat({
                            token,
                            expires: Date.now() + 86400000,
                        });
                        user.isLogged = true;
                        await user.save();
                        user.password = undefined;

                        res.status(200).json(user);
                    });
                } else {
                    user.isLogged = true;
                    await user.save();
                    user.password = undefined;

                    res.status(200).json(user);
                }
            } else {
                jwt.sign(payload, secret, option, async (err, token) => {
                    if (err) return next(createError(500, err));
                    user.tokens = user.tokens.concat({
                        token,
                        expires: Date.now() + 86400000,
                    });
                    user.isLogged = true;
                    await user.save();
                    user.password = undefined;

                    res.status(200).json(user);
                });
            }
        }
    } catch (err) {
        next(err);
    }
};

exports.currentUser = async (req, res, next) => {
    try {
        const user = req.user;
        if (!user) return next(createError(403, "Unauthorized!"));

        const userDb = await db.users.findOne({ username: user.username });
        if (!userDb) return next(createError(403, "Unauthorized!"));
        userDb.password = undefined;

        if (req.session.views) {
            res.status(200).json({ user: userDb, session: req.session });
        } else {
            res.status(200).json(userDb);
        }
    } catch (err) {
        next(err);
    }
};
