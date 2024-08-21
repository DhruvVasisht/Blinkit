const mongoose = require('mongoose');
const paymentSchema=mongoose.Schema({
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'order'
    },
    amount: Number,
    method: String,
    status: String,
    transaction: String,
}); 

module.exports = mongoose.model("payment",paymentSchema);