import { lineNotify } from "#utils/lineNotify";

const sendNotify = async (req, res, next) => {
    try {
        const user = req.body.username;
        const ip = req.ip || req.ips;

        const message = user
            ? `User: ${user} IP: ${ip} is Login Now ${new Date()}`
            : `IP: ${ip} is Login Now ${new Date()}`;

        const body = `message=${message.replace(/ /g, "%20")}`;

        const data = await lineNotify(body);
        req.notify = data;

        next();
    } catch (err) {
        next(err);
    }
};
export default sendNotify;
