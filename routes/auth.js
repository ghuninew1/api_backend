const router = require("express").Router();
const bodyParser = require("body-parser");

const { auth } = require("../middleware/auth");
const { lineNotify } = require("../middleware/notify");

const {
    login,
    register,
    confirmUser,
    currentUser,
} = require("../controllers/auth");

const urlEncode = bodyParser.urlencoded({
    extended: false,
    parameterLimit: 50000,

    limit: "150mb",
});

router.post("/auth/user", auth, currentUser);
router.post("/auth/signin", urlEncode, lineNotify, login);
router.post("/auth/signup", urlEncode, register);
router.post("/auth/confirm", confirmUser);

module.exports = router;
