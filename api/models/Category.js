const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  categoryName: {
    type: String,
  },
});

module.exports = mongoose.model("Category", categorySchema);
