const Book = require('../models/book');
const Joi = require('joi');

// JOI validation schema
const bookSchema = Joi.object({
  title: Joi.string().required().min(1).max(200),
  author: Joi.string().required().min(1).max(100),
  publishedYear: Joi.number().required().min(1000).max(new Date().getFullYear()),
  genre: Joi.string().required().min(1).max(50),
  isbn: Joi.string().required().pattern(/^(?:\d[- ]?){9}[\dX]$/),
  rating: Joi.number().min(0).max(5).default(0),
  summary: Joi.string().required().min(10).max(2000)
});

// Custom error handler
const handleError = (err, res) => {
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: Object.values(err.errors).map(e => e.message) 
    });
  }
  if (err.code === 11000) {
    return res.status(400).json({ 
      error: 'Duplicate Error', 
      message: 'A book with this ISBN already exists' 
    });
  }
  console.error('Error:', err);
  return res.status(500).json({ 
    error: 'Server Error', 
    message: 'An unexpected error occurred' 
  });
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    handleError(err, res);
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }
    handleError(err, res);
  }
};

exports.createBook = async (req, res) => {
  try {
    const { error } = bookSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: error.details.map(detail => detail.message) 
      });
    }

    const book = new Book(req.body);
    const newBook = await book.save();
    res.status(201).json(newBook);
  } catch (err) {
    handleError(err, res);
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { error } = bookSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: error.details.map(detail => detail.message) 
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(updatedBook);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }
    handleError(err, res);
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ 
      message: 'Book deleted successfully',
      deletedBook: {
        id: deletedBook._id,
        title: deletedBook.title
      }
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid book ID format' });
    }
    handleError(err, res);
  }
};
