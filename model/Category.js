const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  color: { type: String },
  icon: { type: String },

//   image: { type: String, required: false },
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
