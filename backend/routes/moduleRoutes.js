import express from "express";
import { getModules } from "../controllers/moduleController.js";

const router = express.Router();

router.get("/", getModules);

export default router;
