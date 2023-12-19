import express from "express";
const router = express.Router();

import { sendMail, sendNotify } from "#controllers/utils.js";
import { authMid } from "#middleware/auth.js";

router.post("/send/notify", authMid, sendNotify);
router.post("/send/mail", authMid, sendMail);

export default router;
