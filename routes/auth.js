import express from "express";
const router = express.Router();

import { authMid } from "../middleware/auth.js";
import {
    login,
    register,
    isUser,
    getUsers,
    editUser,
    deleteUser,
} from "../controllers/auth.js";

router.get("/auth/isuser", authMid, isUser);
router.get("/auth/user", authMid, getUsers);
router.post("/auth/login", login);
router.post("/auth/register", register);
router.put("/auth/edit/:id", authMid, editUser);
router.delete("/auth/delete/:id", authMid, deleteUser);

export default router;
