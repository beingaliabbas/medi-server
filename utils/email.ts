import nodemailer from "nodemailer";

// Configure mail transport for cPanel email
const transporter = nodemailer.createTransport({
    host: "mail.medstuff.pk", // Your cPanel mail server
    port: 465, // Use port 465 for SSL or 587 for TLS
    secure: true, // Use SSL/TLS encryption
    auth: {
        user: "order.confirmation@medstuff.pk", // Your full cPanel email address
        pass: "Aliabbas321@" // Your cPanel email password
    }
});

export async function sendOrderConfirmationEmail(
    customerEmail: string, 
    customerName: string, 
    orderDetails: any
) {
    const mailOptions = {
        from: '"Your Shop" <order.confirmation@medstuff.pk>',
        to: customerEmail,
        subject: "Order Confirmation - Your Order has been placed!",
        html: `
            <h2>Thank you for your order, ${customerName}!</h2>
            <p>Order Details:</p>
            <pre>${JSON.stringify(orderDetails, null, 2)}</pre>
            <p>We will notify you once your order is shipped.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("📩 Order confirmation email sent to:", customerEmail);
    } catch (error) {
        console.error("❌ Error sending email:", error);
    }
}
