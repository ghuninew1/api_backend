const router = require("express").Router();
const { auth, authAdmin } = require("../middleware/auth");
const { lineNotify } = require("../middleware/notify");

const { login, register, currentUser } = require("../controllers/auth");

router.get("/auth/user", auth, currentUser);
router.get("/auth/admin", authAdmin, currentUser);
router.post("/auth/signin", login);
router.post("/auth/signup", register);

module.exports = router;
