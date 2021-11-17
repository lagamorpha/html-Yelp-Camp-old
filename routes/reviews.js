// Variable Block
const express = require('express');
const router = express.Router({ mergeParams: true });

// Methods Block
const { reviewSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utilities/ExpressError');

// Review Validaton Middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log('Validating Review Data!');
    if(error) {
        // console.log(error)
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        console.log('Campground Data Validated!');
        next();
    }
}

// Create Review Via Campgrounds Route
router.post('/', isLoggedIn, validateReview, catchAsync ( async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', `Successfully created a ${review.rating} star rating on the ${campground.title} page!`);
    console.log(`New ${review.rating} Star Review Added to ${campground.title} page!`);
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Delete Review Route
router.delete('/:reviewId', isLoggedIn, catchAsync ( async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review');
    console.log('Review Deleted');
    res.redirect(`/campgrounds/${id}`);
}));

// Export Block
module.exports = router;