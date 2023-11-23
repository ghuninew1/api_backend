const { mailSend } = require("../lib/mailSend");

exports.sendMail = async (req, res) => {
    try {
        const { email, subject, text, html } = req.body;

        if (email !== "" && email !== undefined) {
            await mailSend(email, subject, text, html, (err, info) => {
                if (err) {
                    res.status(404).json("Error occurred. " + err.message);
                    return process.exit(1);
                }
                return res.status(200).json({
                    message: "Message sent: OK",
                    messageId: info.messageId,
                });
            });
        } else {
            res.status(404).json({ message: "email is empty" });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
