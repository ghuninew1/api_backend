import express from "express";
const router = express.Router();

import { authMid } from "#middleware/auth.js";
// import upload from "#middleware/upload.js";
// import {
//     findOne,
//     findById,
//     findAll,
//     deleteAll,
//     updateByid,
//     createByName,
//     deleteByid,
// } from "#controllers/api.js";

// router.get("/api", findAll);
// router.get("/api/:name", findOne);
// router.get("/api/:name/:id", authMid, findById);
// router.post("/api/:name", authMid, createByName);
// router.put("/api/:name/:id", authMid, updateByid);
// router.delete("/api/:name/:id", authMid, deleteByid);
// router.delete("/del/:name", authMid, deleteAll);

export default router;
