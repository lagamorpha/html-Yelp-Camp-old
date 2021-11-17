// Methods Block
const Campground = require('../models/campground');
const Review = require('../models/review');

// create review route export
module.exports.createReview = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', `Successfully created a ${review.rating} star rating on the ${campground.title} page!`);
    console.log(`New ${review.rating} Star Review Added to ${campground.title} page!`);
    res.redirect(`/campgrounds/${campground._id}`);
}

// delete review route export
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review');
    console.log('Review Deleted');
    res.redirect(`/campgrounds/${id}`);
}
