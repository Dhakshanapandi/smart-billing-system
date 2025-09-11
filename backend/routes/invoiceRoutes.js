import express from "express";
import { VerifyToken, permit } from "../middleware/auth.js";
import {
  createInvoice,
  listInvoices,
  getInvoice,
} from "../controllers/invoiceController.js";

const router = express.Router();

router.post(
  "/create-invoice",
  VerifyToken,
  permit("staff", "admin"),
  createInvoice
); // staff creates
router.get("/list", VerifyToken, permit("staff", "admin"), listInvoices); // staff sees their, admin sees all
router.get("/:id", VerifyToken, permit("staff", "admin"), getInvoice);

export default router;
