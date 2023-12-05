import express from "express";
const router = express.Router();

// import { view, visit } from "../middleware/view.js";
import {
    qnapLogin,
    qnapList,
    qnapTree,
    qnapSearch,
    qnapDelete,
} from "../controllers/qnap.js";

router.get("/qnap/login", qnapLogin);
router.get("/qnap/list", qnapList);
router.get("/qnap/tree", qnapTree);
router.get("/qnap/search", qnapSearch);
router.delete("/qnap/delete/:id", qnapDelete);

export default router;
