const mongoose = require('mongoose');
const Joi = require('joi');

// Cart Schema for Mongoose
const cartSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    }
}, { timestamps: true });

// Joi Validation Schema
const validateCart = (cartData) => {
    const schema = Joi.object({
        user: Joi.string().required(), // ObjectId in string format
        products: Joi.array().items(Joi.string().required()).required(), // Array of ObjectIds in string format
        totalPrice: Joi.number().min(0).required() // Total price must be 0 or higher
    });

    return schema.validate(cartData);
};

module.exports = {
    cartModel: mongoose.model("cart", cartSchema),
    validateCart,
};
