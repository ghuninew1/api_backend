import express from "express";
const router = express.Router();

import { sendMail, sendNotify } from "../controllers/utils.js";

router.post("/send/notify", sendNotify);
router.post("/send/mail", sendMail);

export default router;
