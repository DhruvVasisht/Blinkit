const mongoose = require('mongoose');
const orderSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    }
],
    totalPrice: Number,
    address:String,
    status:String,
    payment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'payment'
    },
    deivery:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'delivery'
    }

}); 

module.exports = mongoose.model("order",orderSchema);