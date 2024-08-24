const express = require('express');
const router = express.Router();
const { productModel, validateProduct } = require('../models/product');
const { categoryModel, validateCategory } = require('../models/category');
const upload = require('../config/multer-config');  
const validateAdmin= require('../middlewares/admin');

router.get("/", async (req, res) => {
    try {
        let prods = await productModel.find();
        res.send(prods);
    } catch (error) {
        res.status(500).send("Error fetching products: " + error.message);
    }
});

router.get("/delete/:id",validateAdmin,async (req, res) => {
    try {
        let prods = await productModel.findOneAndDelete({_id: req.params.id});
        res.redirect("");
    } catch (error) {
        res.status(500).send("Error fetching products: " + error.message);
    }
});


router.post("/", upload.single("image"), async (req, res) => {
    let { name, price, category, stock, description } = req.body;
    
    // Convert the image buffer to a base64 string if the image exists
    let image = req.file ? req.file.buffer.toString('base64') : null; 
    
    // Validate the product including the image
    let { error } = validateProduct({ 
        name,
        price,
        category,
        stock,
        description,
        image 
    });

    if (error) return res.status(400).send(error.message);
     
    // Check if the category exists, otherwise create it
    let isCategory = await categoryModel.findOne({ name: category });
    if (!isCategory) {
        await categoryModel.create({ name: category });
    }

    // Create the product with the validated data
    let product = await productModel.create({
        name,
        price,
        category,
        image,
        stock,
        description
    });

    res.redirect("/admin/dashboard");   
});


module.exports = router;
