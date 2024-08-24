const express = require('express');
const app = express();
const indexRouter = require('./routes');
const authRouter= require('./routes/auth');
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/products');
const categoriesRouter = require('./routes/category');
const userRouter = require('./routes/user');
const path = require('path');
const connectDB=require("./config/mongoose-connection");
const expressSession = require('express-session');
const cookieParser=require('cookie-parser');
const passport = require('passport');
require('dotenv').config();
require("./config/google_oauth_config");

app.set('view engine', 'ejs');
connectDB();
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/admin",adminRouter);
app.use("/products",productRouter);
app.use("/categories",categoriesRouter);
app.use("/users",userRouter);


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});