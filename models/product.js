const mongoose = require('mongoose');
const Joi = require('joi');

// Product Schema for Mongoose
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    stock: {
        type: Boolean,
        required: true,
        default: true
    },
    description: {
        type: String,
    },
    image: {
        type: String,
    }
}, { timestamps: true });

// Joi Validation Schema
const validateProduct = (productData) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(), // Product name
        price: Joi.number().min(0).required(), // Product price must be 0 or higher
        category: Joi.string().min(3).max(50).required(), // Product category
        stock: Joi.boolean().required(), // Stock status
        description: Joi.string().optional(), // Optional description
        image: Joi.string().optional() // Image URL validation
    });

    return schema.validate(productData);
};

// Create and export Mongoose model
module.exports ={
    productModel: mongoose.model("product", productSchema),
    validateProduct,
};
