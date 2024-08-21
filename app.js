const express = require('express');
const app = express();
const indexRouter = require('./routes');
const authRouter= require('./routes/auth');
const path = require('path');
const connectDB=require("./config/mongoose-connection");
const expressSession = require('express-session');
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

app.use("/", indexRouter);
app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});