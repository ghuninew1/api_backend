const ping = require("ping");
const db = require("../models");
const dns = require("dns");

exports.pingCheck = async (req, res) => {
    try {
        const ip = req.query.ip;
        const ipss = ip?.split(",");
        if (ip == null || ip == "") {
            return res.status(404).json("input ip");
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
        res.status(500).json("Server Error: " + err + " " + err.message);
    }
};

exports.ipPublic = async (req, res) => {
    try {
        const ip = req.query.ip;

        if (ip) {
            const ipinfo = `https://ipinfo.io/${ip}/json?token=f44742fe54a2b2`;
            const Response = await fetch(ipinfo);
            const data = await Response.json();
            if (data.error) {
                return res.status(404).json("Not Found");
            } else {
                return res.status(200).json(data);
            }
        } else {
            const url = "https://ipinfo.io/json?token=f44742fe54a2b2";
            const Response = await fetch(url);
            const data = await Response.json();
            if (data.error) {
                return res.status(404).json("Not Found");
            } else {
                return res.status(200).json(data);
            }
        }
    } catch (err) {
        res.status(500).json("Server Error: " + err + " " + err.message);
    }
};

exports.getIpTimeSeries = async (req, res) => {
    try {
        const ip = req.query.ip;
        if (ip == null || ip == "") {
            return res.status(404).json("input ip");
        }
        await dns.reverse(ip, async (err, host) => {
            if (err) {
                return res.status(404).json("Not Found");
            } else {
                const ping = await db.visit.find({});
                const count = await db.visit.countDocuments({});
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
        res.status(500).json("Server Error: " + err);
    }
};
