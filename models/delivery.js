const mongoose = require('mongoose');
const deliverySchema=mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'order'
    },
    deliveryBoy: String,
    amount: Number,
    trackingURL: String,
    estimatedDeliveryTime:Number,
}); 

module.exports = mongoose.model("delivery",deliverySchema);