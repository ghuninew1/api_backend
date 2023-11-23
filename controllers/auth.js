const db = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { secret, option } = require("./auth.config");

exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (
            username === "" ||
            password === "" ||
            username == null ||
            password == null
        )
            throw res
                .status(404)
                .json({ msg: "please enter name or password" });

        let user = await db.users.findOne({ username });

        user && res.status(400).json({ msg: "User already exists" });

        const salt = await bcrypt.genSalt(10);
        user = new db.users({
            username,
            password,
            email,
            roles: [
                {
                    role: "user",
                    id: 100,
                },
            ],
        });
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        user = user.toObject();
        delete user.password;
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ msg: `Error retrieving data: ${err}` });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (
            username === "" ||
            password === "" ||
            username == null ||
            password == null
        )
            throw res
                .status(404)
                .json({ msg: "please enter name or password" });

        const user = await db.users.findOneAndUpdate(
            { username },
            { new: true }
        );
        if (user && user.enabled) {
            const isMatch = bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ msg: "Invalid Credentials" });

            let payload = {
                user: {
                    username: user.username,
                    email: user.email,
                    token: user.tokens[0]?.token,
                    expires: user.tokens[0]?.expires,
                },
            };
            if (user.tokens.length > 0) {
                const token = user.tokens[0];
                if (Date.now() > token.expires) {
                    user.tokens = [];
                    await user.save();
                    jwt.sign(payload, secret, option, async (err, token) => {
                        if (err) throw res.status(500).json({ msg: err });
                        user.tokens = user.tokens.concat({
                            token,
                            expires: Date.now() + 86400000,
                        });
                        await user.save();
                        res.status(200).json(payload.user);
                    });
                } else {
                    res.status(200).json(payload.user);
                }
            } else {
                jwt.sign(payload, secret, option, async (err, token) => {
                    if (err) throw res.status(500).json({ msg: err });
                    user.tokens = user.tokens.concat({
                        token,
                        expires: Date.now() + 86400000,
                    });
                    await user.save();

                    res.status(200).json({
                        username: user.username,
                        email: user.email,
                        token: user.tokens[0]?.token,
                        expires: user.tokens[0]?.expires,
                    });
                });
            }
        } else return res.status(400).json({ msg: "Invalid Credentials" });
    } catch (err) {
        res.status(500).json({ msg: `Error retrieving data: ${err}` });
    }
};

exports.currentUser = async (req, res) => {
    try {
        const user = await db.users
            .findOne({ username: req.user.username })
            .select("-password")
            .exec();
        if (!user) throw res.status(404).json({ msg: "User not found" });

        res.status(200).json({
            username: user.username,
            email: user.email,
            role_id: user.roles[0]?.id,
            token: user.tokens[0]?.token,
            expires: user.tokens[0]?.expires,
            updatedAt: user.updatedAt,
        });
    } catch (err) {
        res.status(500).json({ msg: `Error retrieving data: ${err}` });
    }
};

exports.confirmUser = async (req, res) => {
    try {
        const username = req.query.username;
        if (username === "" || username == null)
            throw res.status(404).json({ msg: "please enter name" });

        const user = await db.users.findOneAndUpdate(
            { username: username },
            { new: true }
        );

        !user && res.status(400).json({ msg: "User not found" });

        if (user.enabled === false) {
            user.enabled = true;
            await user.save();
            res.status(200).json({
                enabled: true,
                username: user.username,
            });
        } else {
            user.enabled = false;
            await user.save();
            res.status(200).json({
                enabled: false,
                username: user.username,
            });
        }
    } catch (err) {
        res.status(500).json({ msg: `Error retrieving data: ${err}` });
    }
};
