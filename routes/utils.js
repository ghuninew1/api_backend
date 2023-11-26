const router = require("express").Router();
const fs = require("fs");

const { lineNotify } = require("../controllers/notify");
const { sendMail } = require("../controllers/mailer");
const {
    getConvertToAvif,
    getConvertToWebp,
    getResizeFile,
    resizeMultiple,
} = require("../controllers/images");
const { pingCheck, ipPublic, getIpTimeSeries } = require("../controllers/ping");
const { visitUpdate } = require("../middleware/visit");
const { upload, uploadMultiple } = require("../middleware/upload");

router.post("/notify", lineNotify);
router.post("/mail", sendMail);
router.get("/ping", visitUpdate, pingCheck);
router.get("/ip", visitUpdate, ipPublic);
router.get("/ipdb", getIpTimeSeries);
router.get("/ipdb/:ip", getIpTimeSeries);

router.post("/resize", upload, getResizeFile);
router.post("/resizes", uploadMultiple, resizeMultiple);
router.post("/webp", upload, getConvertToWebp);
router.post("/avif", upload, getConvertToAvif);

router.get("/uploads", (req, res) => {
    const filesList = fs.readdirSync("./public/uploads");
    const files = filesList.map((file, idx) => {
        return {
            isFolder: fs.lstatSync(`./public/uploads/${file}`).isDirectory(),
            file,
            url: `${req.protocol}://${req.get("host")}/uploads/${file}`,
        };
    });
    res.send(files);
});
router.get("/uploads/:folder", (req, res) => {
    const { folder } = req.params;
    const filesList = fs.readdirSync(`./public/uploads/${folder}`);
    const files = filesList.map((file) => {
        const isFolder = fs.lstatSync(`./public/uploads/${folder}/${file}`);
        return {
            isFolder: isFolder.isDirectory(),

            file,
            url: `${req.protocol}://${req.get(
                "host"
            )}/uploads/${folder}/${file}`,
        };
    });
    res.send(files);
});
router.get("/uploads/:folder/:folder2", (req, res) => {
    const { folder, folder2 } = req.params;
    const filesList = fs.readdirSync(`./public/uploads/${folder}/${folder2}`);
    const files = filesList.map((file) => {
        const isFolder = fs.lstatSync(
            `./public/uploads/${folder}/${folder2}/${file}`
        );
        return {
            isFolder: isFolder.isDirectory(),
            file,
            url: `${req.protocol}://${req.get(
                "host"
            )}/uploads/${folder}/${folder2}/${file}`,
        };
    });
    res.send(files);
});

module.exports = router;
