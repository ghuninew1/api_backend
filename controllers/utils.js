import { mailSend, createError, lineNotify } from "../utils/index.js";

export const sendNotify = async (req, res, next) => {
    try {
        const message = req.query.message || req.body.message;

        if (message === undefined && message === "") {
            return next(createError(404, "message is empty"));
        }

        const body = `message=${message.replace(/ /g, "%20")}`;

        const Notify = await lineNotify(body);
        const data = await Notify;

        return res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

export const sendMail = async (req, res, next) => {
    try {
        const { email, subject, text, html } = req.body;

        if (email === "" && email === undefined) {
            return next(createError(404, "email is empty"));
        }

        await mailSend(email, subject, text, html, (err, info) => {
            if (err) {
                return next(createError(500, err));
            }
            return res.status(200).json({
                message: "Message sent: OK",
                messageId: info.messageId,
            });
        });
    } catch (err) {
        next(err);
    }
};
