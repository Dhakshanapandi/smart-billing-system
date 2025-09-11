import express from 'express';
import { createStaff, listStaff, editStaff, deleteStaff } from '../controllers/staffController.js';
import { VerifyToken, permit } from '../middleware/auth.js';

const router = express.Router();

// Admin only
router.post('/staff-create', VerifyToken, permit('admin'), createStaff);
router.get('/get-staff', VerifyToken, permit('admin'), listStaff);
router.put('/edit-staff/:id', VerifyToken, permit('admin'), editStaff);
router.delete('/delete-staff/:id', VerifyToken, permit('admin'), deleteStaff);

export default router;
