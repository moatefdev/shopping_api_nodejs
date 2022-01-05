require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
const path = require("path");
var logger = require("morgan");

const cors = require("cors");
const mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const productRouter = require("./routes/products");
const orderRouter = require("./routes/order");
const categoryRouter = require("./routes/category");

var app = express();

app.use(cors());

app.use(logger("dev"));

// mongoose.connect("mongodb://localhost/shopping-api", (err) => {
//   if (err) {
//     console.log(err);
//     return;
//   } else {
//     console.log("connected to DB");
//   }
// });

mongoose.connect(process.env.DB_URL, (err) => {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("connected to DB");
  }
});

// console.log(path.join(__dirname, "productImage"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "productImage")));

app.use("/", indexRouter);
app.use("/products", productRouter);
app.use("/order", orderRouter);
app.use("/users", usersRouter);
app.use("/category", categoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
  });
});

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

module.exports = app;
