import express from "express";
import { dailyReport, rangeReport } from "../controllers/reportController.js";
import { VerifyToken, permit } from "../middleware/auth.js";

const router = express.Router();

router.get("/daily", VerifyToken, permit("admin"), dailyReport);
router.get("/range", VerifyToken, permit("admin"), rangeReport);

export default router;
