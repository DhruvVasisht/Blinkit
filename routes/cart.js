const express = require('express');
const router = express.Router();
const { cartModel } = require('../models/cart');
const { productModel } = require('../models/product');
const { userIsLoggedIn } = require('../middlewares/admin');

// Get Cart
router.get("/", userIsLoggedIn, async (req, res) => {
    try {
        const userId = req.session.passport.user;
        let cart = await cartModel.findOne({ user: userId }).populate("products");

        if (!cart || cart.products.length === 0) {
            return res.render("cart", { cart: [], finalprice: 0 });
        }

        let cartDataStructure = {};

        cart.products.forEach(product => {
            let key = product._id.toString();
            if (cartDataStructure[key]) {
                cartDataStructure[key].quantity += 1;
            } else {
                cartDataStructure[key] = {
                    ...product._doc,
                    quantity: 1,
                };
            }
        });

        let finalArray = Object.values(cartDataStructure);
        res.render("cart", { cart: finalArray, finalprice: cart.totalPrice });

    } catch (err) {
        res.status(500).send("An error occurred while fetching the cart.");
    }
});

// Add Product to Cart
router.get("/add/:id", userIsLoggedIn, async (req, res) => {
    try {
        const userId = req.session.passport.user;
        const productId = req.params.id;

        let cart = await cartModel.findOne({ user: userId });
        let product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).send("Product not found.");
        }

        if (!cart) {
            cart = await cartModel.create({
                user: userId,
                products: [productId],
                totalPrice: product.price,
            });
        } else {
            cart.products.push(productId);
            cart.totalPrice += product.price;
            await cart.save();
        }

        res.redirect("back");
    } catch (err) {
        res.status(500).send("An error occurred while adding the product to the cart.");
    }
});

// Increase Product Quantity in Cart
router.post("/increase/:id", userIsLoggedIn, async (req, res) => {
    try {
        const userId = req.session.passport.user;
        const productId = req.params.id;

        let cart = await cartModel.findOne({ user: userId });
        let product = await productModel.findById(productId);

        if (!cart || !product) {
            return res.status(404).send("Cart or product not found.");
        }

        cart.products.push(productId);
        cart.totalPrice += product.price;
        await cart.save();

        res.redirect("/cart");
    } catch (err) {
        res.status(500).send("An error occurred while increasing the product quantity.");
    }
});

// Decrease Product Quantity in Cart
router.post("/decrease/:id", userIsLoggedIn, async (req, res) => {
    try {
        const userId = req.session.passport.user;
        const productId = req.params.id;

        let cart = await cartModel.findOne({ user: userId });

        if (!cart) return res.status(404).send("Cart not found.");

        let index = cart.products.indexOf(productId);

        if (index !== -1) {
            let product = await productModel.findById(productId);
            cart.products.splice(index, 1);
            cart.totalPrice -= product.price;

            // If the cart becomes empty after removal, clear the cart
            if (cart.products.length === 0) {
                await cartModel.deleteOne({ user: userId });
            } else {
                await cart.save();
            }
        }

        res.redirect("/cart");
    } catch (err) {
        res.status(500).send("An error occurred while decreasing the product quantity.");
    }
});

module.exports = router;
