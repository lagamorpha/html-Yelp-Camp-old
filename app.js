const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database Connected!');
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended:true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
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

app.get('/', (req, res) => {
    console.log('Login to Root Page!');
    res.render('home');
});

app.get('/campgrounds', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    console.log('Login to Campgrounds Page!');
    res.render('campgrounds/index', { campgrounds });
}));

app.get('/campgrounds/new', (re, res) => {
    console.log('Login to New Campground Page!');
    res.render('campgrounds/new');
});

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    console.log('Campground saved!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    console.log(`Login to ${campground.title} Page!`);
    // console.log(campground);
    res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    console.log(`Login to Edit Campgrounds Page!`);
    res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { new: true });
    console.log('Editing Campground Page!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    console.log(`${deletedCampground} Deleted`);
    res.redirect('/campgrounds');
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    console.log(`New ${review.rating} Star Review Added to ${campground.title}`);
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(req.params.reviewId);
    console.log('Review Deleted');
    res.redirect(`/campgrounds/${id}`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no, Something went wrong!';
    console.log(`Warning: ${err.statusCode} Error, ${err.message}!`);
    res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
    console.log('Server Active on Port 3000!');
});