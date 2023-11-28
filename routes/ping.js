import express from "express";
const router = express.Router();

import { pingCheck, ipPublic, getIpTimeSeries } from "../controllers/ping.js";
import { view, visit } from "../middleware/view.js";

router.get("/ping", visit, pingCheck);
router.get("/ip", visit, ipPublic);
router.get("/ipdb", getIpTimeSeries);
router.get("/ipdb/:ip", getIpTimeSeries);

export default router;
