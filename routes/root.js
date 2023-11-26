const router = require("express").Router();
const { spawnSync } = require("child_process");

router.get("/", (req, res) => {
    res.status(200).json({
        message: "API GhuniNew",
        ip: req.ip,
        protocol: req.protocol,
        uptime: Math.floor(process.uptime() * 1000) / 1000,
        session: req.session,
    });
});

router.get("/ps", async (req, res) => {
    try {
        const spaw = spawnSync("ps", ["au"]);
        if (spaw.stderr.toString().length > 0) {
            throw res.status(500).json({ error: spaw.stderr.toString() });
        }

        if (spaw.stdout.toString().length === 0) {
            throw res.status(500).json({ error: "No data" });
        }
        const data = spaw.stdout.toString().split("\n");
        const dataArr = [];
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
        res.status(200).json(dataArr);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
