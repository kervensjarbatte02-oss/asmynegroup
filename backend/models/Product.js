const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  description: String,
  slug: String
});

module.exports = mongoose.model('Product', ProductSchema);
