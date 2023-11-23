const jwt = require("jsonwebtoken");
const { secret } = require("../controllers/auth.config");

exports.auth = (req, res, next) => {
    try {
        const token = req.headers["authtoken"];
        if (token == null) throw res.status(401).json({ msg: "Unauthorized!" });

        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return res.status(401).json({
                        message: "Unauthorized! Access Token was expired!",
                    });
                }
                return res.status(401).json({ message: "Unauthorized!" });
            }
            req.user = decoded?.user;
            next();
        });
    } catch (err) {
        res.status(500).json({ msg: `Error retrieving data: ${err}` });
    }
};
