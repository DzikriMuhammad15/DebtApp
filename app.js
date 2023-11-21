// ! REQUIERE
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");
const authRoute = require("./routes/authRoutes");
const authMiddlewares = require("./middlewares/authMiddlewares");
const socialRoutes = require("./routes/socialRoutes");
const debtRoutes = require("./routes/debtRoutes")
const paymentRoutes = require("./routes/paymentRoutes");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/dashboard');
const User = require("./models/User");

var app = express();

// ! view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//! MIDDLEWARE SETUP
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ! DATABASE CONNECTION
const DbURI = "mongodb+srv://mrpdzikri:150403Database@cluster0.bkbukuu.mongodb.net/firstProject"
const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(DbURI, options)
  .then((result) => {
    app.listen(3030, () => {
      console.log("listening on port 3030...");
    })
  })
  .catch((err) => console.log(err));


//! ROUTE
app.use(authMiddlewares.authCheck);
app.use('/', indexRouter);
app.use('/dashboard', authMiddlewares.protectRoute, usersRouter);
app.use('/social', authMiddlewares.protectRoute, socialRoutes);
app.use("/auth", authRoute);
app.use("/debt", authMiddlewares.protectRoute, debtRoutes);
app.use("/payment", authMiddlewares.protectRoute, paymentRoutes);
app.use("/adminHub", (req, res) => {
  res.render("adminHub")
})




module.exports = app;