import express from "express";
const router = express.Router();

import { spawnSync } from "child_process";

import { view, visit } from "../middleware/view.js";
import { createError } from "../utils/createError.js";

router.get("/", view, (req, res) => {
    res.status(200).json({
        message: "API GhuniNew",
        ip: req.ip,
        protocol: req.protocol,
        uptime: Math.floor(process.uptime() * 1000) / 1000,
        session: req.session,
    });
});

router.get("/ps", (req, res, next) => {
    try {
        const spaw = spawnSync("ps", ["au"]);

        if (spaw.stderr.toString().length > 0) {
            return next(createError(500, spaw.stderr.toString()));
        }

        if (spaw.stdout.toString().length === 0) {
            return next(createError(500, "No data"));
        }

        let data = spaw.stdout.toString().split("\n");
        let dataArr = [];
        data.pop();
        data.shift();

        data.forEach((item) => {
            const itemArr = item.split(/\s+/);
            const itemObj = {
                user: itemArr[0],
                pid: itemArr[1],
                cpu: itemArr[2],
                mem: itemArr[3],
                vsz: itemArr[4],
                rss: itemArr[5],
                tty: itemArr[6],
                stat: itemArr[7],
                start: itemArr[8],
                time: itemArr[9],
                command: itemArr[10],
            };
            dataArr.push(itemObj);
        });

        return res.status(200).json(dataArr);
    } catch (err) {
        next(err);
    }
});

export default router;
