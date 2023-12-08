import express from "express";
const router = express.Router();

import { authMid } from "../middleware/auth.js";
// import upload from "../middleware/upload.js";
import {
    list,
    findById,
    createNew,
    editByid,
    deleteByid,
    deleteAll,
} from "../controllers/com.js";

router.get("/com", authMid, list);
router.get("/com/:id", authMid, findById);
router.post("/com", authMid, createNew);
router.put("/com/:id", authMid, editByid);
router.delete("/com/:id", authMid, deleteByid);
router.delete("/com", authMid, deleteAll);

export default router;
