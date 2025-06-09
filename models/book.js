const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  publishedYear: Number,
  genre: String,
  isbn: String,
  rating: Number,
  summary: String
});

module.exports = mongoose.model('Book', bookSchema);
