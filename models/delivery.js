const mongoose = require('mongoose');
const Joi = require('joi');

// Delivery Schema for Mongoose
const deliverySchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    deliveryBoy: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    trackingURL: {
        type: String,
    },
    estimatedDeliveryTime: {
        type: Number,
        required: true,
        min: 0 // Represents time in minutes or hours, depending on your application
    }
}, { timestamps: true });

// Joi Validation Schema
const validateDelivery = (deliveryData) => {
    const schema = Joi.object({
        order: Joi.string().required(), // ObjectId in string format
        deliveryBoy: Joi.string().min(3).max(50).required(), // Delivery boy's name
        amount: Joi.number().min(0).required(), // Delivery amount
        trackingURL: Joi.string().uri(), // Valid URL format
        estimatedDeliveryTime: Joi.number().min(0).required() // Non-negative estimated time
    });

    return schema.validate(deliveryData);
};

// Create and export Mongoose model
module.exports = {
    deliveryModel: mongoose.model("Delivery", deliverySchema),
    validateDelivery,
};
