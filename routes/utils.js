const router = require("express").Router();
const { lineNotify } = require("../controllers/notify");
const { sendMail } = require("../controllers/mailer");
const { pingCheck, ipPublic, getIpTimeSeries } = require("../controllers/ping");
const { visitUpdate } = require("../middleware/visit");

router.post("/notify", lineNotify);
router.post("/mail", sendMail);
router.get("/ping", visitUpdate, pingCheck);
router.get("/ip", visitUpdate, ipPublic);
router.get("/ipdb", getIpTimeSeries);

module.exports = router;
