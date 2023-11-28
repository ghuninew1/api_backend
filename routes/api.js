import express from "express";
const router = express.Router();

import { view, visit } from "../middleware/view.js";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
    findOne,
    findById,
    findAll,
    deleteAll,
    updateByid,
    createByName,
    deleteByid,
} from "../controllers/api.js";

router.get("/api", /* auth, */ view, findAll);
router.get("/api/:name", /* auth, */ findOne);
router.get("/api/:name/:id", /* auth, */ findById);
router.post("/api/:name", createByName);
router.put("/api/:name/:id", updateByid);
router.delete("/api/:name/:id", /* auth, */ deleteByid);
router.delete("/del/:name", /* auth, */ deleteAll);

export default router;
