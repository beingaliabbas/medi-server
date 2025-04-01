
import express from 'express';
import { 
  getOrders, 
  getOrderById, 
  createOrder,
  updateOrderStatus 
} from '../controllers/orderController';
import { protect } from '../controllers/authController';

const router = express.Router();

// Public routes
router.post('/', createOrder);

// Protected routes
router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, updateOrderStatus);

export default router;
