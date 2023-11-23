const router = require("express").Router();
const {
    qnapList,
    qnapTree,
    qnapLogin,
    qnapSearch,
    qnapDelete,
} = require("../controllers/qnap");

router.get("/qnap/login", qnapLogin);
router.get("/qnap/list", qnapList);
router.get("/qnap/tree", qnapTree);
router.get("/qnap/search", qnapSearch);
router.delete("/qnap/delete/:id", qnapDelete);

module.exports = router;
