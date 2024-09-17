const express = require('express');
const router = express.Router();
const { productModel, validateProduct } = require('../models/product');
const { categoryModel } = require('../models/category');
const { cartModel } = require('../models/cart');
const upload = require('../config/multer-config');
const { validateAdmin, userIsLoggedIn } = require('../middlewares/admin');

router.get("/", userIsLoggedIn, async (req, res) => {
    let somethingInCart = false;
    try {
        // Fetch grouped products by category
        const resultArray = await productModel.aggregate([
            {
                $group: {
                    _id: "$category",
                    products: { $push: "$$ROOT" }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    products: { $slice: ["$products", 10] }
                }
            }
        ]);

        // Check if the user has something in the cart
        let cart = await cartModel.findOne({ user: req.session.passport.user }).populate("products");
        if (cart && cart.products && cart.products.length > 0) somethingInCart = true;

        // Fetch 4 random products for 'Order Now' section
        let rnproducts = await productModel.aggregate([{ $sample: { size: 4 } }]);

        // Map the rnproducts and resultArray to include base64 encoded image
        rnproducts = rnproducts.map(product => ({
            ...product,
            image: product.image ? product.image.toString('base64') : '', // Convert Buffer to Base64 string
            imageType: 'image/jpeg' // Adjust this based on the actual image type
        }));

        // Grouped products (by category) including base64 images
        const resultObject = resultArray.reduce((acc, item) => {
            acc[item.category] = item.products.map(product => ({
                ...product,
                image: product.image ? product.image.toString('base64') : '', // Convert Buffer to Base64 string
                imageType: 'image/jpeg' // Adjust this based on the actual image type
            }));
            return acc;
        }, {});

        // Render the homepage with products and cart information
        res.render("index", { 
            products: resultObject, 
            rnproducts, 
            somethingInCart, 
            cartCount: cart ? cart.products.length : 0 
        });
    } catch (error) {
        // Handle any errors
        res.status(500).send("Error fetching products: " + error.message);
    }
});



module.exports = router;
