import { Request, Response } from 'express';
import Order from '../models/Order';
import axios from 'axios';

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

    const orderItems: { name: string; price: number; quantity: number }[] = items;

    const order = new Order({
      orderNumber,
      customerInfo,
      items: orderItems,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
      status: 'confirmed'
    });

    const createdOrder = await order.save();

    // Send data to PHP mailer endpoint
    try {
  const emailResponse = await axios.post('https://medstuff.pk/mailer.php', {
    to: customerInfo.email,
    name: customerInfo.fullName,
    orderNumber,
    items: orderItems,
    total
  });
  console.log("Email send response:", emailResponse.data);  // Log the response from the email service
} catch (emailError: any) {
  console.error('Email send failed via mailer.php:', emailError.response ? emailError.response.data : emailError.message);
  return res.status(500).json({
    message: 'Order created but email sending failed',
    error: emailError.message
  });
}

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
