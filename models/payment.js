const mongoose = require('mongoose');
const Joi = require('joi');

// Payment Schema for Mongoose
const paymentSchema = mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    method: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    transaction: {
        type: String,
        required: true,
        unique: true,
    }
}, { timestamps: true });

// Joi Validation Schema
const validatePayment = (paymentData) => {
    const schema = Joi.object({
        order: Joi.string().required(), // ObjectId in string format
        amount: Joi.number().min(0).required(), // Amount must be 0 or higher
        method: Joi.string().required(), // Valid payment methods
        status: Joi.string().required(), // Valid statuses
        transaction: Joi.string().required() // Transaction ID must be at least 10 alphanumeric characters
    });

    return schema.validate(paymentData);
};

module.exports ={
    paymentModel: mongoose.model("payment", paymentSchema),
    validatePayment,
};
