import User from "#models/User.model.js";
import bcrypt from "bcryptjs";
import createError from "#utils/createError.js";

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_TOKEN;

const handleLogin = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return next(createError(400, "Please enter all fields"));

        const foundUser = await User.findOneAndUpdate(
            { username },
            { new: true }
        );
        if (!foundUser) return next(createError(400, "User does not exist"));
        // evaluate password
        const match = await bcrypt.compare(password, foundUser.password);
        if (match) {
            const payload = {
                username: username,
                roles: foundUser.roles,
            };
            if (foundUser.expires > Date.now()) {
                res.cookie("jwt", foundUser.refreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                });

                // Send authorization roles and access token to user
                res.status(200).json({
                    username: foundUser.username,
                    roles: foundUser.roles,
                    expires: foundUser.expires,
                    img: foundUser.img,
                });
            } else {
                // create JWTs
                const newRefreshToken = jwt.sign(payload, refreshSecret, {
                    expiresIn: "1d",
                });

                // Saving refreshToken with current user
                foundUser.refreshToken = newRefreshToken;
                foundUser.expires = Date.now() + 24 * 60 * 60 * 1000; // 1 day

                await foundUser.save();

                // Creates Secure Cookie with refresh token
                res.cookie("jwt", newRefreshToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "None",
                    maxAge: 24 * 60 * 60 * 1000, // 1 day
                });

                // Send authorization roles and access token to user
                res.status(200).json({
                    username: foundUser.username,
                    roles: foundUser.roles,
                    expires: foundUser.expires,
                    img: foundUser.img,
                });
            }
        } else {
            return next(createError(400, "Invalid Credentials"));
        }
    } catch (err) {
        next(err);
    }
};

export default handleLogin;
