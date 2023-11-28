import express from "express";
const router = express.Router();

import {
    getResizeFile,
    resizeMultiple,
    getConvertToWebp,
    getConvertToAvif,
    listFiles,
} from "../controllers/images.js";
import { upload } from "../middleware/upload.js";

router.post("/resize", upload.single("file"), getResizeFile);
router.post("/resizes", upload.array("files", 50), resizeMultiple);
router.post("/webp", upload.single("file"), getConvertToWebp);
router.post("/avif", upload.single("file"), getConvertToAvif);

router.get("/uploads", listFiles);
router.get("/uploads/:folder", listFiles);
router.get("/uploads/:folder/:folder2", listFiles);
router.get("/uploads/:folder/:folder2/:folder3", listFiles);

export default router;
