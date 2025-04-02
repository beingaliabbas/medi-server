import { Request, Response } from 'express';
import Order, { IOrder } from '../models/Order';
import nodemailer from 'nodemailer';  // Import nodemailer

const transporter = nodemailer.createTransport({
  host: "mail.medstuff.pk",
  port: 2525, // Change to 2525 if 465/587 is blocked
  secure: false, // Set to false if using port 2525
  auth: {
    user: "order.confirmation@medstuff.pk",
    pass: "Aliabbas321@", // Store this in environment variables
  },
  tls: {
    rejectUnauthorized: false, // Helps avoid TLS issues
  },
});
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

    // Explicitly type `items`
    const orderItems: { name: string; price: number; quantity: number }[] = items;

    const order = new Order({
      orderNumber,
      customerInfo,
      items: orderItems, // Assign the typed items array
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
      status: 'confirmed'
    });

    const createdOrder = await order.save();

    // Send email
    const mailOptions = {
      from: '"MedStuff" <order.confirmation@medstuff.pk>',
      to: customerInfo.email,
      subject: `Order Confirmation - ${orderNumber}`,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #3e8e41;">Thank You for Your Order!</h2>
            <p>Dear <strong>${customerInfo.fullName}</strong>,</p>
            <p>Thank you for your order. Your order number is <strong>${orderNumber}</strong>.</p>
            <h3 style="color: #3e8e41;">Order Details:</h3>
            <ul>
              ${orderItems.map((item) => `<li>${item.name} - Quantity: ${item.quantity} - Price: PKR ${item.price}</li>`).join('')}
            </ul>
            <p><strong>Total: PKR ${total}</strong></p>
            <p>If you have any questions, feel free to contact us at <a href="mailto:order.confirmation@medstuff.pk">order.confirmation@medstuff.pk</a>.</p>
            <p>Best regards,<br/>The MedStuff Team</p>
          </body>
        </html>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ message: 'Order created but email failed to send', error: error.message });
      }
      console.log('Email sent: ' + info.response);
    });

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
