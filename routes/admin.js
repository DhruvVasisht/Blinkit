const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { adminModel} = require('../models/admin');
const validateAdmin = require('../middlewares/admin');
const { productModel } = require('../models/product');
const { categoryModel } = require('../models/category');
require("dotenv").config();

if (
    typeof process.env.NODE_ENV !== "undefined" &&
    process.env.NODE_ENV === "development"
) {
    router.get("/create", async (req, res) => {
        try {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash("admin", salt);
            let user = new adminModel({
                name: "Dhruv",
                email: "admin@blinkit.com",
                password: hash,
                role: "admin"
            });
            await user.save();
            let token = jwt.sign({
               email: "admin@blinkit.com", admin: true }, process.env.JWT_KEY);
            res.cookie("token", token, { httpOnly: true, secure: false });
            res.send("Admin Created Successfully");
        } catch (err) {
            res.send(err.message);
        }
    });
}

router.get("/login", (req, res) => {
    res.render("admin_login");
});

router.post("/login", async (req, res) => {
    let { email, password } = req.body;
    try {
        let admin = await adminModel.findOne({ email });
        if (!admin) return res.status(404).send("This Admin does not exist");

        let valid = await bcrypt.compare(password, admin.password);
        if (!valid) return res.status(400).send("Invalid credentials");

        let token = jwt.sign({ email: admin.email, admin:true }, process.env.JWT_KEY);
        res.cookie("token", token, { httpOnly: true, secure: false });
        return res.redirect("/admin/dashboard");
    } catch (err) {
        return res.status(500).send("Internal Server Error");
    }
});

router.get("/dashboard", validateAdmin,async (req, res) => {
 let prodcount= await productModel.countDocuments()
 let categcount= await categoryModel.countDocuments()
 res.render("admin_dashboard",{prodcount,categcount});
});

router.get("/products", validateAdmin, async (req, res) => {
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
      
      // Convert the array into an object
      const resultObject = resultArray.reduce((acc, item) => {
        acc[item.category] = item.products;
        return acc;
      }, {});
  
      // Render the view and pass the resultObject
      res.render("admin_products", { products: resultObject });
  
    } catch (error) {
      // Handle errors appropriately
      console.error("Error fetching products:", error);
      res.status(500).send("Server Error");
    }
  });
  

router.get("/logout", (req, res) => {
    res.cookie("token","");
    res.redirect("/admin/login");
});

module.exports = router;
