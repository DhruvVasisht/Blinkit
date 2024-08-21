const mongoose = require('mongoose');
const Joi = require('joi');

// Admin Schema for Mongoose
const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'superadmin'] // Example roles
    }
}, { timestamps: true });

// Joi Validation Schema with Regex
const validateAdmin = (adminData) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), // Basic email regex
        password: Joi.string().min(6).required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/), // At least one letter and one number
        role: Joi.string().valid('admin', 'superadmin').required() // Ensures role is either 'admin' or 'superadmin'
    });

    return schema.validate(adminData);
};

module.exports ={
    adminModel: mongoose.model("admin", adminSchema),
    validateAdmin,
};
