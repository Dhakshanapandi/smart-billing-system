import express from "express";
import { getStaffDashboardReport } from "../controllers/staffDashController.js";
import { getDashboardReport } from "../controllers/dashboardController.js";
import { permit, VerifyToken } from "../middleware/auth.js";

const router = express.Router();

router.get("/admin", VerifyToken, permit("admin"), getDashboardReport);
router.get("/staff", VerifyToken, permit("staff"), getStaffDashboardReport);

export default router;
