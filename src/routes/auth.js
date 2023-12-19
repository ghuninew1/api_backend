import express from "express";
const router = express.Router();

import { authMid } from "#middleware/auth.js";
import {
    handleLogin,
    handleLogout,
    handleRegister,
    handleRefreshToken,
    authLine,
} from "#controllers/auth/index.js";
import { getUser } from "#controllers/auth/user.js";

router.post("/auth/login", handleLogin);
router.post("/auth/register", handleRegister);
router.get("/auth/logout", handleLogout);
router.post("/auth/refresh", handleRefreshToken);
router.post("/auth/loginline", authLine);
router.get("/auth/user", authMid, getUser);

export default router;
