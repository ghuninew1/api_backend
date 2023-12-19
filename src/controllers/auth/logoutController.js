import User from "#models/User.model.js";
import createError from "#utils/createError.js";

const handleLogout = async (req, res, next) => {
    try {
        // On client, also delete the accessToken
        const cookies = req.cookies["jwt"];
        if (!cookies) return res.sendStatus(204);

        res.clearCookie("jwt", {
            httpOnly: true,
            sameSite: "None",
            secure: true,
        });
        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
};

export default handleLogout;
