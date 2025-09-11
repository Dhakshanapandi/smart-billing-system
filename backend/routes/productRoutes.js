import express from 'express';
import { addProduct, listProducts, editProduct, deleteProduct } from '../controllers/productController.js';
import { VerifyToken, permit } from '../middleware/auth.js';

const router = express.Router();

// Staff and admin can add/list products
router.post('/new-product', VerifyToken, permit('staff','admin'), addProduct);
router.get('/', VerifyToken, listProducts);

// edit/delete product: we let the creator or admin edit/delete (simple version: admin allowed; staff allowed too)
router.put('/:id', VerifyToken, permit('admin','staff'), editProduct);
router.delete('/:id', VerifyToken, permit('admin','staff'), deleteProduct);

export default router;
