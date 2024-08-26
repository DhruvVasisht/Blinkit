const express = require('express');
const router = express.Router();
const { orderModel, validateOrder } = require('../models/order');
const { paymentModel, validatePayment } = require('../models/payment');
const crypto = require('crypto');

// Route to handle the "Place Order" functionality
router.post('/place-order', async (req, res) => {
    try {
        const { userId, products, totalPrice, address, deliveryId } = req.body;

        // Validate order data
        const orderData = {
            user: userId,
            products: products,
            totalPrice: totalPrice,
            address: address,
            status: 'Pending', // Default status
            delivery: deliveryId, // Delivery details
            payment: null // Will be updated after payment creation
        };

        const { error: orderError } = validateOrder(orderData);
        if (orderError) return res.status(400).send(orderError.details[0].message);

        // Create and save the order
        const order = new orderModel(orderData);
        await order.save();

        // Generate a fake transaction ID for the "Order Now" functionality
        const transactionId = crypto.randomBytes(10).toString('hex');

        // Create payment data
        const paymentData = {
            order: order._id,
            amount: totalPrice,
            method: 'Cash on Delivery', // Default method
            status: 'Pending', // No actual payment made
            transaction: transactionId,
        };

        // Validate payment data using Joi
        const { error: paymentError } = validatePayment(paymentData);
        if (paymentError) return res.status(400).send(paymentError.details[0].message);

        // Save payment data to the database
        const payment = new paymentModel(paymentData);
        await payment.save();

        // Update the order with the payment ID
        order.payment = payment._id;
        await order.save();

        res.status(200).send({ success: true, message: "Order placed successfully", transactionId });
    } catch (err) {
        res.status(500).send("Something went wrong");
    }
});

module.exports = router;
