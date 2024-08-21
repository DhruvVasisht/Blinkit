const mongoose = require('mongoose');
const Joi = require('joi');

const AddressSchema = mongoose.Schema({
    state: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    zip: {
        type: Number,
        required: true,
        min: 10000,
        max: 999999
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
});


const userSchema = mongoose.Schema({
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
    phone: {
        type: Number,
        required: true,
        minlength: 10
    },
    addresses: [AddressSchema]
}, { timestamps: true });


const validateUser = (userData) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/), 
        password: Joi.string().min(6).required().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/), // At least one letter and one number
        phone: Joi.string().regex(/^[0-9]{10}$/).required(), 
        addresses: Joi.array().items(
            Joi.object({
                state: Joi.string().min(2).max(50).required(),
                zip: Joi.number().min(10000).max(999999).required(),
                city: Joi.string().required(),
                address: Joi.string().required()
            })
        ).required()
    });

    return schema.validate(userData);
};

module.exports ={
    userModel: mongoose.model("user", userSchema),
    validateUser,
};
