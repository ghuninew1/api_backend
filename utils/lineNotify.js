import axios from "axios";

const lineNotify = (message) => {
    try {
        if (message === "" && message == null) {
            return Promise.reject("message is empty");
        }

        const url = process.env.LINE_NOTIFY_URL;
        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Bearer ${process.env.LINE_NOTIFY_TONKEN2}`,
        };
        const body = `message=${message.replace(/ /g, "%20")}`;

        const dataSent = axios.post(url, body, { headers });

        return Promise.resolve(dataSent.data);
    } catch (err) {
        return Promise.reject(err);
    }
};

export default lineNotify;
