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

        let cart = await cartModel.findOne({ user: req.session.passport.user }).populate("products");
        if (cart && cart.products && cart.products.length > 0) somethingInCart = true;

        let rnproducts = await productModel.aggregate([{ $sample: { size: 4 } }]);

        rnproducts = rnproducts.map(product => ({
            ...product,
            imageType: product.image ? 'image/jpeg' : '' // Adjust this based on actual image type
        }));

        const resultObject = resultArray.reduce((acc, item) => {
            acc[item.category] = item.products.map(product => ({
                ...product,
                imageType: product.image ? 'image/jpeg' : '' // Adjust this based on actual image type
            }));
            return acc;
        }, {});

        res.render("index", { products: resultObject, rnproducts, somethingInCart, cartCount: cart ? cart.products.length : 0 });
    } catch (error) {
        res.status(500).send("Error fetching products: " + error.message);
    }
});


module.exports = router;
