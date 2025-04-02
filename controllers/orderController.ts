import { Request, Response } from 'express';
import Order, { IOrder } from '../models/Order';

export const getOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Database error';
    console.error('Error fetching orders:', errorMessage);
    res.status(500).json({ message: 'Server Error', error: errorMessage });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Database error';
    console.error('Error fetching order:', errorMessage);
    res.status(500).json({ message: 'Server Error', error: errorMessage });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { orderNumber, customerInfo, items, paymentMethod, subtotal, shipping, tax, total } = req.body;
    
    if (!orderNumber || !customerInfo || !items || items.length === 0) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    const order = new Order({
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
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Database error';
    console.error('Error creating order:', errorMessage);
    res.status(500).json({ message: 'Server Error', error: errorMessage });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Database error';
    console.error('Error updating order status:', errorMessage);
    res.status(500).json({ message: 'Server Error', error: errorMessage });
  }
};