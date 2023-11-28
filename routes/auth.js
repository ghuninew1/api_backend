import express from "express";
const router = express.Router();

import { auth, authAdmin } from "../middleware/auth.js";
import { login, register, currentUser } from "../controllers/auth.js";

router.get("/auth/user", auth, currentUser);
router.post("/auth/login", login);
router.post("/auth/register", register);

export default router;
