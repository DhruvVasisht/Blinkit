const mongoose = require('mongoose');
const Joi = require('joi');


const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3, // Minimum length for name
        maxlength: 50 // Maximum length for name
    }
}, { timestamps: true });

// Joi Validation Schema
const validateCategory = (categoryData) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required() // Validates name length and requirement
    });

    return schema.validate(categoryData);
};

module.exports ={
    categoryModel: mongoose.model("category", categorySchema),
    validateCategory,
};
