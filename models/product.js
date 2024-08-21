const mongoose = require('mongoose');

const productSchema=mongoose.Schema({
    name:String,
    price:Number,
    category:String,
    stock:Boolean,
    description: String,
    image:String,
}); 

module.exports = mongoose.model("product",productSchema);