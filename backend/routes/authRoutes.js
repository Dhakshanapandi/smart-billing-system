import express, { Router } from "express";
import {
  login,
  createAdminIfNotExists,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/login", login);

router.post("/create-admin", createAdminIfNotExists);

export default router;
