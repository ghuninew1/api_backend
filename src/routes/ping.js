import express from "express";
const router = express.Router();

import { pingCheck, ipPublic, getIpTimeSeries } from "#controllers/ping.js";

router.get("/ping", pingCheck);
router.get("/ip", ipPublic);
router.get("/ipdb", getIpTimeSeries);
router.get("/ipdb/:ip", getIpTimeSeries);

export default router;
