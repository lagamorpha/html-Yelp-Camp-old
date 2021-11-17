// methods block
const ExpressError = require('./utilities/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const Campground = require('./models/campground');
const Review = require('./models/review');

// login verification middleware
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('You must be signed in to do this!');
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in to do this!');
        return res.redirect('/login');
    }
    console.log('User authenticated!');
    next();
}

// Campground Validaton MiddleWare
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    console.log('Validating Campground Data!');
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        console.log('Campground Data Validated!');
        next();
    }
    // console.log(result);
}

// author validation route
module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        console.log('Error updating, invalid permissions!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// review author validation route
module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        console.log('Error updating, invalid permissions!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// Review Validaton Middleware
module.exports.validateReview = (req, res, next) => {
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