import User from "#models/User.model.js";
import createError from "#utils/createError.js";

const secret = process.env.JWT_SECRET;
const refreshSecret = process.env.JWT_REFRESH_TOKEN;

const handleRefreshToken = async (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return next(createError(403, "Forbidden"));
    const refreshToken = cookies.jwt;

    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

    const foundUser = await User.findOneAndUpdate(
        { refreshToken },
        { new: true }
    );

    const payload = {
        username: username,
        roles: foundUser.roles,
    };

    // Detected refresh token reuse!
    if (!foundUser) {
        jwt.verify(refreshToken, refreshSecret, async (err, decoded) => {
            if (err) return next(createError(403, "Forbidden"));
            // Delete refresh tokens of hacked user
            const hackedUser = await User.findOneAndUpdate(
                { username: decoded.username },
                { new: true }
            );
            hackedUser.refreshToken = [];

            await hackedUser.save();
        });
        return res.sendStatus(403); //Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(
        (rt) => rt !== refreshToken
    );

    // evaluate jwt
    jwt.verify(refreshToken, refreshSecret, async (err, decoded) => {
        if (err) {
            // expired refresh token
            foundUser.refreshToken = [...newRefreshTokenArray];
            await foundUser.save();
        }
        if (err || foundUser.username !== decoded.username)
            return next(createError(403, "Forbidden"));

        // Refresh token was still valid
        const accessToken = jwt.sign(payload, secret, { expiresIn: "10s" });

        const newRefreshToken = jwt.sign(payload, refreshSecret, {
            expiresIn: "15s",
        });
        // Saving refreshToken with current user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        await foundUser.save();

        // Creates Secure Cookie with refresh token
        res.cookie("jwt", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.json({ accessToken });
    });
};

export default handleRefreshToken;
