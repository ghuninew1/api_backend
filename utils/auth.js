// const jwt = require("jsonwebtoken");
import jwt from "jsonwebtoken";

const verify = (token, secret) => {
    if (token) {
        return jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    return false;
                }
                return false;
            }
            return decoded;
        });
    } else {
        return false;
    }
};

const useDecode = (token) => {
    if (token) {
        try {
            const decoded = jwt.decode(token, { complete: true });
            return decoded;
        } catch (err) {
            return false;
        }
    } else {
        return false;
    }
};

//Using async await
const decode = async (token) => {
    if (token) {
        try {
            const decoded = await jwt.decode(token, { complete: true });
            return decoded;
        } catch (err) {
            return false;
        }
    } else {
        return false;
    }
};

//Using async await
const useSign = async (payload, secret, option) => {
    if (payload) {
        try {
            const token = await jwt.sign(payload, secret, option);
            return token;
        } catch (err) {
            return false;
        }
    } else {
        return false;
    }
};

const sign = (payload, secret, option) => {
    if (payload) {
        try {
            const token = jwt.sign(payload, secret, option);
            return token;
        } catch (err) {
            return false;
        }
    } else {
        return false;
    }
};

export { verify, useDecode, decode, useSign, sign };
export default { verify, useDecode, decode, useSign, sign };
