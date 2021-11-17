// Variable Block
const express = require('express');
const router = express.Router();

// Methods Block
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const catchAsync = require('../utilities/catchAsync');
const Campground = require('../models/campground');

// Campgrounds Routes

// Campgrounds Index Route
router.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    console.log('Login to Campgrounds Page!');
    res.render('campgrounds/index', { campgrounds });
}));

// Campgrounds Create Routes
router.get('/new', isLoggedIn, (req, res) => {
    console.log('Login to New Campground Page!');
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn, validateCampground, catchAsync ( async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', `Successfully created ${campground.title} campground page!`);
    console.log('Campground saved!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Campgrounds Display Route
router.get('/:id', catchAsync ( async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews', 
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground) {
        req.flash('error', 'Cannot find that campground, redirecting to index!');
        console.log('Cannot find that campground, redirecting to index!');
        return res.redirect('/campgrounds');
    }
    console.log(`Login to ${campground.title} Page!`);
    // console.log(campground);
    res.render('campgrounds/show', { campground });
}));

// Campgrounds Update Routes
router.get('/:id/edit',  isLoggedIn, isAuthor, catchAsync ( async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Cannot find that campground, redirecting to index!');
        console.log('Cannot find that campground, redirecting to index!');
        return res.redirect('/campgrounds');
    }
    console.log(`Login to Edit Campgrounds Page!`);
    res.render('campgrounds/edit', { campground });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync ( async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { new: true });
    req.flash('success', `Successfully updated ${campground.title} campground page!`);
    console.log('Editing Campground Page!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

// Campgrounds Delete Route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync ( async (req, res) => {
    
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${deletedCampground.title} Campground Page and Reviews!`);
    console.log(`${deletedCampground} Deleted`);
    res.redirect('/campgrounds');
}));

// Export Block
module.exports = router;