import ping from "ping";
import dns from "node:dns";
import Visit from "../models/Visit.model.js";

export const pingCheck = async (req, res) => {
    try {
        const ip = req.query.ip;
        const ipss = ip?.split(",");
        if (ip == null || ip == "") {
            return res.status(404).json({ message: "input ip" });
        }

        if (ipss.length === 1) {
            const ress = await ping.promise.probe(ip, {
                timeout: 10,
                extra: ["-i", "2"],
            });
            return res.status(200).json(ress);
        } else {
            let result = [];
            for (let i = 0; i < ipss?.length; i++) {
                const ress = await ping.promise.probe(ipss[i], {
                    timeout: 10,
                    extra: ["-i", "2"],
                });

                result.push(ress);
            }
            return res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const ipPublic = async (req, res) => {
    try {
        const ip = req.query.ip;

        if (ip) {
            const ipinfo = `https://ipinfo.io/${ip}/json?token=f44742fe54a2b2`;
            const Response = await fetch(ipinfo);
            const data = await Response.json();
            if (data.error) {
                return res.status(404).json({ message: "Not Found" });
            } else {
                return res.status(200).json(data);
            }
        } else {
            const url = "https://ipinfo.io/json?token=f44742fe54a2b2";
            const Response = await fetch(url);
            const data = await Response.json();
            if (data.error) {
                return res.status(404).json({ message: "Not Found" });
            } else {
                return res.status(200).json(data);
            }
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getIpTimeSeries = async (req, res) => {
    try {
        const ip = req.query.ip || req.ip;
        if (ip == null || ip == "") {
            return res.status(404).json("input ip");
        }
        dns.reverse(ip, async (err, host) => {
            if (err) {
                return res.status(404).json({ message: "Not Found" });
            } else {
                const ping = await Visit.find({});
                const count = await Visit.countDocuments({});
                const result = {
                    ip: ip,
                    host: host,
                    count: count,
                    ping: ping,
                };
                return res.status(200).json(result);
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
