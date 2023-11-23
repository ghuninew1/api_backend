const router = require("express").Router();
const { spawnSync } = require("child_process");

router.get("/", async (req, res) => {
    try {
        const spaw = spawnSync("ps", ["au"]);
        if (spaw.stderr.toString().length > 0) {
            throw new Error(spaw.stderr.toString());
        }

        if (spaw.stdout.toString().length === 0) {
            throw new Error("No data returned");
        }
        const data = spaw.stdout.toString().split("\n");
        const dataArr = [];
        data.pop();
        data.shift();

        data.forEach((item) => {
            const itemArr = item.split(/\s+/);
            const itemObj = {
                "": itemArr[0],
                PID: itemArr[1],
                TT: itemArr[2],
                STAT: itemArr[3],
                TIME: itemArr[4],
                COMMAND: itemArr[5],
                "": itemArr[6],
                "": itemArr[7],
                "": itemArr[8],
                "": itemArr[9],
                "": itemArr.slice(10).join(" "),
            };
            dataArr.push(itemObj);
        });
        res.status(200).json(dataArr);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
