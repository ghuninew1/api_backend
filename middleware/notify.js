const { lineNotifyFn } = require("../lib/notifyFn");

exports.lineNotify = async (req, res, next) => {
    try {
        const user = req.body.username;
        const ip = req.ip || req.ips;

        const message = user
            ? `User: ${user} IP: ${ip} is Login Now ${new Date()}`
            : `IP: ${ip} is Login Now ${new Date()}`;

        const body = `message=${message.replace(/ /g, "%20")}`;

        const data = await lineNotifyFn(body);

        req.lineNotify = data;

        next();
    } catch (err) {
        res.status(500).json({ msg: `Error retrieving data: ${err}` });
    }
};
