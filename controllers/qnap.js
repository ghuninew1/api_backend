require("dotenv").config();
const axios = require("axios").default;
const { ezEncode, utf16to8 } = require("../utils/get_sid");
const { parseStringPromise } = require("xml2js");
const db = require("../models");
const Qnap = db.qnap;

const qnapHost = process.env.QNAP_HOST;
const endpoint = qnapHost + "/cgi-bin/";
const cgi = endpoint + "filemanager/utilRequest.cgi";

const loginUrl = endpoint + `authLogin.cgi`;

exports.qnapLogin = async (req, res) => {
    try {
        const user = req.query.user || process.env.QNAP_USER;
        const pass = req.query.pass || process.env.QNAP_PASS;
        const passEnc = ezEncode(utf16to8(pass));
        const data = await axios.get(loginUrl + `?user=${user}&pwd=${passEnc}`);
        const dataXml = await parseStringPromise(data.data);
        const dataSid = dataXml["QDocRoot"]["authSid"][0];
        if (dataSid) {
            // const qnap = new Qnap({
            //     authSid: dataSid,
            //     username: dataXml["QDocRoot"]["username"][0],
            //     groupname: dataXml["QDocRoot"]["groupname"][0],
            //     ts: dataXml["QDocRoot"]["ts"][0],
            //     suid: dataXml["QDocRoot"]["SUID"][0],
            //     cuid: dataXml["QDocRoot"]["cuid"][0],
            //     function_support: dataXml["QDocRoot"]["function_support"][0],
            // });
            // await qnap.save();
            return res.status(200).json(dataSid);
        } else {
            return res.status(403).json({ message: "login failed" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.qnapTree = async (req, res) => {
    try {
        const sid = req.query.sid || "";
        if (sid === "" || sid == "null") {
            return res.status(403).json({ message: "sid is required" });
        }

        const node = req.query.node || "/sky"; // /sky or /sky/xxx
        const is_iso = req.query.is_iso || 0; // 0 or 1
        const url =
            cgi + `?func=get_tree&sid=${sid}&is_iso=${is_iso}&node=${node}`;
        const data = await axios.get(url);

        if (data && data.data?.length > 0) {
            return res.status(200).json(data.data);
        } else {
            return res.status(403).json({ message: "tree failed" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.qnapList = async (req, res) => {
    try {
        const sid = req.query.sid || "";
        if (sid === "" || sid == "null") {
            return res.status(403).json({ message: "sid is required" });
        }

        const is_iso = req.query.is_iso || 0; // 0 or 1
        const list_mode = req.query.list_mode || "all"; // all or file
        const path = req.query.path || "/sky"; // /sky or /sky/xxx
        const dir = req.query.dir || "ASC"; // ASC or DESC
        const limit = req.query.limit || 100; // 100 or 1000
        const sort = req.query.sort || "filename"; // filename or mtime
        const start = 0;
        const hidden_file = req.query.hidden_file || 0; // 0 or 1
        const url =
            cgi +
            `?func=get_list&sid=${sid}&is_iso=${is_iso}&list_mode=${list_mode}&path=${path}&dir=${dir}&limit=${limit}&sort=${sort}&start=${start}&hidden_file=${hidden_file}`;
        const dataRes = await axios.get(url);

        if (dataRes.data) {
            return res.status(200).json(dataRes.data);
        } else {
            return res.status(403).json({ message: "list failed" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.qnapSearch = async (req, res) => {
    try {
        const sid = req.query.sid || "";
        if (sid === "" || sid == "null") {
            return res.status(403).json({ message: "sid is required" });
        }

        const keyword = req.query.keyword || "";
        const source_path = req.query.source_path || "/sky";
        const dir = req.query.dir || "ASC"; // ASC or DESC
        const limit = req.query.limit || 100;
        const sort = req.query.sort || "filename";
        const start = 0;
        const url =
            cgi +
            `?func=search&sid=${sid}&keyword=${keyword}&source_path=${source_path}&dir=${dir}&limit=${limit}&sort=${sort}&start=${start} `;
        const dataRes = await axios.get(url);
        if (dataRes.status === 403 || dataRes.status === 400) {
            const data = await qnapSid();
            const dataSid = JSON.stringify(data);
            sid = dataSid.replace(/"/g, "");
            const dataRes = await axios.get(
                url.replace(/sid=v3l6y9b8/g, `sid=${sid}`)
            );
            return res.status(200).json(dataRes.data);
        }
        if (dataRes.data?.datas.length > 0) {
            return res.status(200).json(dataRes.data);
        } else {
            return res.status(403).json({ message: "search failed" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

exports.qnapDelete = async (req, res) => {
    try {
        const sid = req.query.sid || "";
        if (sid === "" || sid == "null") {
            return res.status(403).json({ message: "sid is required" });
        }

        const path = req.query.path || "";
        const file_total = req.query.file_total || 1;
        const file_name = req.query.file_name || "";
        const url =
            cgi +
            `?func=delete&sid=${sid}&path=${path}&file_total=${file_total}&file_name=${file_name}`;

        const dataRes = await axios.delete(url);
        if (dataRes.status === 403 || dataRes.status === 400) {
            const data = await qnapSid();
            const dataSid = JSON.stringify(data);
            sid = dataSid.replace(/"/g, "");
            const dataRes = await axios.delete(
                url.replace(/sid=v3l6y9b8/g, `sid=${sid}`)
            );
            return res.status(200).json("delete success");
        }
        if (dataRes.data?.datas.length > 0) {
            return res.status(200).json("delete success");
        } else {
            return res.status(403).json({ message: "delete failed" });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
