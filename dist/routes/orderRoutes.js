"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const authController_1 = require("../controllers/authController");
const router = express_1.default.Router();
// Public routes
router.post('/', orderController_1.createOrder);
// Protected routes
router.get('/', authController_1.protect, orderController_1.getOrders);
router.get('/:id', authController_1.protect, orderController_1.getOrderById);
router.put('/:id/status', authController_1.protect, orderController_1.updateOrderStatus);
exports.default = router;
