import express from "express";
const router = express.Router();

import { sendMail, sendNotify } from "../controllers/utils.js";

router.post("/notify", sendNotify);
router.post("/mail", sendMail);

export default router;
