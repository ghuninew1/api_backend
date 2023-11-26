require("dotenv").config();
const axios = require("axios").default;

exports.lineNotifyFn = async (message) => {
    try {
        if (message !== undefined && message !== "") {
            const url = process.env.LINE_NOTIFY_URL;
            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Bearer ${process.env.LINE_NOTIFY_TONKEN2}`,
            };
            const body = `message=${message.replace(/ /g, "%20")}`;

            const lineNotify = await axios.post(url, body, { headers });
            const data = await lineNotify.data;

            return data;
        } else console.log("Not Found enter message");
    } catch (err) {
        console.log(err.message);
    }
};
