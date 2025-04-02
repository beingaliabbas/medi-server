import express from 'express';
import { 
  getOrders, 
  getOrderById, 
  createOrder,
  updateOrderStatus 
} from '../controllers/orderController';
import { protect } from '../controllers/authController';  // Ensure 'protect' middleware is defined

const router = express.Router();

// Public routes
router.post('/', createOrder);  // To create a new order

// Protected routes (authentication required)
router.get('/', protect, getOrders);  // To get a list of orders
router.get('/:id', protect, getOrderById);  // To get a single order by ID
router.put('/:id/status', protect, updateOrderStatus);  // To update order status

export default router;
