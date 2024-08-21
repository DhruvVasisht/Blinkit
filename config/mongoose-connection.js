const mongoose = require('mongoose');
const connectDb =async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL)
        .then(()=>{
        console.log('Connected to MongoDB');
        })
    }
    catch(err){
        console.log("MongoDB Connection error: ",err);
        process.exit(1);
    }
};

module.exports = connectDb;