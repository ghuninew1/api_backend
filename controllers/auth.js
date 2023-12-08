import Users from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

const secret = process.env.JWT_SECRET;
const secretRefresh = process.env.JWT_REFRESH_TOKEN;
const options = {
    expiresIn: "10h",
    algorithm: "HS256",
};

function generateAccessToken(payload) {
    return jwt.sign(payload, secret, options);
}

export async function register(req, res, next) {
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
}

export async function login(req, res, next) {
    try {
        const { username, password } = req.body;

        if (!username || !password)
            return next(createError(400, "Please enter all fields"));

        const user = await Users.findOneAndUpdate({ username }, { new: true });

        if (!user) return next(createError(400, "User does not exist"));

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return next(createError(400, "Invalid Credentials"));

        const payload = {
            username: user.username,
            isAdmin: user.isAdmin || false,
        };

        if (!user?.token) {
            const accessToken = generateAccessToken(payload);
            user.token = accessToken;
            user.expires = Date.now() + 1000 * 60 * 60 * 10; // 10h

            await user.save();
            user.password = undefined;

            return res.status(200).json(user);
        } else if (Date.now() > user.expires) {
            const accessToken = generateAccessToken(payload);
            user.token = accessToken;
            user.expires = Date.now() + 1000 * 60 * 60 * 10; // 10h

            await user.save();
            user.password = undefined;

            return res.status(200).json(user);
        } else {
            user.password = undefined;

            return res.status(200).json(user);
        }
    } catch (err) {
        next(err);
    }
}

export function isUser(req, res, next) {
    try {
        const authHeader =
            req.headers["authorization"] || req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (token == null)
            return next(createError(401, "Unauthorized! Access Denied!"));

        const decoded = jwt.verify(token, secret);

        res.status(200).json(decoded);
    } catch (err) {
        next(err);
    }
}

export async function getUsers(req, res, next) {
    try {
        const { username } = req.user;
        const users = await Users.findOne({ username }).select("-password");

        if (!username || !users) {
            return next(createError(400, "users not found"));
        }

        return res.status(200).json(users);
    } catch (err) {
        next(err);
    }
}

export async function editUser(req, res, next) {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return next(createError(400, "Please enter all fields"));
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const user = await Users.findByIdAndUpdate(id, {
            username,
            email,
            password: hash,
        });

        if (!user) {
            return next(createError(400, "user not found"));
        }

        return res.status(200).json({ msg: "User updated" });
    } catch (err) {
        next(err);
    }
}

export async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;

        const user = await Users.findByIdAndDelete(id);

        if (!user) {
            return next(createError(400, "user not found"));
        }

        return res.status(200).json({ msg: "User deleted" });
    } catch (err) {
        next(err);
    }
}
