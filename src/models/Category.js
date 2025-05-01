const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  //_id:{},
  wording: { type: String, required: true },
});

module.exports = mongoose.model('Category', CategorySchema);
