const mongoose = require('mongoose');
const Joi = require('joi');

// Order Schema for Mongoose
const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    address: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 200
    },
    status: {
        type: String,
        required: true,
        enum: ['Pending', 'Processed', 'Shipped', 'Delivered', 'Cancelled'], // Example statuses
        default: 'Pending'
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
        required: true
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Delivery',
        required: true
    }
}, { timestamps: true });

// Joi Validation Schema
const validateOrder = (orderData) => {
    const schema = Joi.object({
        user: Joi.string().required(), // ObjectId in string format
        products: Joi.array().items(Joi.string().required()).required(), // Array of ObjectIds in string format
        totalPrice: Joi.number().min(0).required(), // Total price must be 0 or higher
        address: Joi.string().min(10).max(200).required(), // Address string length validation
        status: Joi.string().valid('Pending', 'Processed', 'Shipped', 'Delivered', 'Cancelled').required(), // Valid statuses
        payment: Joi.string().required(), // Payment ObjectId in string format
        delivery: Joi.string().required() // Delivery ObjectId in string format
    });

    return schema.validate(orderData);
};

// Create and export Mongoose model
module.exports ={
    orderModel: mongoose.model("order", orderSchema),
    validateOrder,
};

