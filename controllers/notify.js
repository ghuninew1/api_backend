const { lineNotifyFn } = require("../lib/notifyFn");

exports.lineNotify = async (req, res) => {
    try {
        const message = req.query.message || req.body.message;
        if (message !== undefined && message !== "") {
            const body = `message=${message.replace(/ /g, "%20")}`;

            const lineNotify = await lineNotifyFn(body);
            const data = await lineNotify;

            res.status(200).json(data);
        } else
            return res.status(404).json({ message: "Not Found enter message" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
