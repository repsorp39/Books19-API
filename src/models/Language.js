const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
  //_id:{},
  wording: { type: String, required: true },
});

module.exports = mongoose.model('Language', LanguageSchema);
