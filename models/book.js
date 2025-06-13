const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [1, 'Title cannot be empty']
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  publishedYear: {
    type: Number,
    required: [true, 'Published year is required'],
    min: [1000, 'Published year must be after 1000'],
    max: [new Date().getFullYear(), 'Published year cannot be in the future']
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^(?:\d[- ]?){9}[\dX]$/.test(v);
      },
      message: 'Invalid ISBN format'
    }
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot exceed 5'],
    default: 0
  },
  summary: {
    type: String,
    required: [true, 'Summary is required'],
    trim: true,
    minlength: [10, 'Summary must be at least 10 characters long']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for faster queries
bookSchema.index({ title: 1, author: 1 });
bookSchema.index({ genre: 1 });

module.exports = mongoose.model('Book', bookSchema);
