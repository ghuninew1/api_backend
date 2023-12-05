import createError from "../utils/createError.js";
import mailSend from "../utils/mailSend.js";
import lineNotify from "../utils/lineNotify.js";

export const sendNotify = async (req, res, next) => {
    try {
        const message = req.query.message || req.body.message;

        if (message === "" && message == null) {
            return next(createError(404, "message is empty"));
        }

        const body = `message=${message.replace(/ /g, "%20")}`;

        const Notify = await lineNotify(body);

        if (Notify instanceof Error) {
            return next(createError(404, Notify.message));
        }

        return res.status(200).json({ message: "send notify success" });
    } catch (err) {
        next(err);
    }
};

export const sendMail = async (req, res, next) => {
    try {
        const { email, subject, text, html } = req.body;

        if (email === "" && email == null) {
            return next(createError(404, "email is empty"));
        }

        const mail = await mailSend(email, subject, text, html);
        if (mail instanceof Error) {
            return next(createError(404, mail.message));
        }

        return res.status(200).json({ message: "send mail success" });
    } catch (err) {
        next(err);
    }
};
