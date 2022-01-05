const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  category: {
    type: String,
  },
  name: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    require: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
