// Variable Block
const express = require('express');
const router = express.Router({ mergeParams: true });

// Methods Block
const reviews = require('../controllers/reviews');
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware');
const catchAsync = require('../utilities/catchAsync');

// Create Review Via Campgrounds Route
router.post('/', isLoggedIn, validateReview, catchAsync (reviews.createReview));

// Delete Review Route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync (reviews.deleteReview));

// Export Block
module.exports = router;