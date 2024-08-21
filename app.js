const express = require('express');
const app = express();
const indexRouter = require('./routes');
const authRouter= require('./routes/auth');
const path = require('path');
const connectDB=require("./config/mongoose-connection");
require('dotenv').config();
require("./config/google_oauth_config");

app.set('view engine', 'ejs');
connectDB();
app.use(express.static(path.join(__dirname,"public")));

app.use("/", indexRouter);
app.use("/auth", authRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});