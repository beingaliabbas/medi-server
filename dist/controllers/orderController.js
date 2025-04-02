"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.createOrder = exports.getOrderById = exports.getOrders = void 0;
const Order_1 = __importDefault(require("../models/Order"));
const getOrders = async (req, res) => {
    try {
        const orders = await Order_1.default.find({}).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Database error';
        console.error('Error fetching orders:', errorMessage);
        res.status(500).json({ message: 'Server Error', error: errorMessage });
    }
};
exports.getOrders = getOrders;
const getOrderById = async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id);
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Database error';
        console.error('Error fetching order:', errorMessage);
        res.status(500).json({ message: 'Server Error', error: errorMessage });
    }
};
exports.getOrderById = getOrderById;
const createOrder = async (req, res) => {
    try {
        const { orderNumber, customerInfo, items, paymentMethod, subtotal, shipping, tax, total } = req.body;
        if (!orderNumber || !customerInfo || !items || items.length === 0) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }
        const order = new Order_1.default({
            orderNumber,
            customerInfo,
            items,
            paymentMethod,
            subtotal,
            shipping,
            tax,
            total,
            status: 'confirmed'
        });
        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Database error';
        console.error('Error creating order:', errorMessage);
        res.status(500).json({ message: 'Server Error', error: errorMessage });
    }
};
exports.createOrder = createOrder;
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!status)
            return res.status(400).json({ message: 'Status is required' });
        const order = await Order_1.default.findById(req.params.id);
        if (!order)
            return res.status(404).json({ message: 'Order not found' });
        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Database error';
        console.error('Error updating order status:', errorMessage);
        res.status(500).json({ message: 'Server Error', error: errorMessage });
    }
};
exports.updateOrderStatus = updateOrderStatus;
