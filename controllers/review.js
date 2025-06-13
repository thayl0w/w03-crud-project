const Review = require('../models/review');
const Book = require('../models/book');
const Joi = require('joi');

// JOI validation schema
const reviewSchema = Joi.object({
  bookId: Joi.string().required(),
  rating: Joi.number().required().min(1).max(5),
  title: Joi.string().required().min(3).max(100),
  content: Joi.string().required().min(10).max(1000),
  isVerifiedPurchase: Joi.boolean().default(false)
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
      message: 'You have already reviewed this book' 
    });
  }
  console.error('Error:', err);
  return res.status(500).json({ 
    error: 'Server Error', 
    message: 'An unexpected error occurred' 
  });
};

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'displayName')
      .populate('bookId', 'title')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    handleError(err, res);
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('userId', 'displayName')
      .populate('bookId', 'title');
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid review ID format' });
    }
    handleError(err, res);
  }
};

exports.createReview = async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: error.details.map(detail => detail.message) 
      });
    }

    // Verify book exists
    const book = await Book.findById(req.body.bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const review = new Review({
      ...req.body,
      userId: req.user._id // From authenticated session
    });

    const newReview = await review.save();
    const populatedReview = await Review.findById(newReview._id)
      .populate('userId', 'displayName')
      .populate('bookId', 'title');

    res.status(201).json(populatedReview);
  } catch (err) {
    handleError(err, res);
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ 
        error: 'Validation Error', 
        details: error.details.map(detail => detail.message) 
      });
    }

    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('userId', 'displayName')
     .populate('bookId', 'title');

    res.json(updatedReview);
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid review ID format' });
    }
    handleError(err, res);
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns the review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    res.json({ 
      message: 'Review deleted successfully',
      deletedReview: {
        id: deletedReview._id,
        title: deletedReview.title
      }
    });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid review ID format' });
    }
    handleError(err, res);
  }
}; 