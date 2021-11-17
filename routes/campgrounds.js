// Variable Block
const express = require('express');
const router = express.Router();

// Methods Block
const campgrounds = require('../controllers/campgrounds');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const catchAsync = require('../utilities/catchAsync');

// Campgrounds Routes

// campgrounds index router routes
router.route('/')
    .get(catchAsync (campgrounds.index))
    .post(isLoggedIn, validateCampground, catchAsync (campgrounds.createCampground));

// Campgrounds Create Route
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

// campground id router routes
router.route('/:id')
    .get(catchAsync (campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync (campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync (campgrounds.deleteCampground));

// Campgrounds Update Route
router.get('/:id/edit',  isLoggedIn, isAuthor, catchAsync (campgrounds.renderEditForm));

// Export Block
module.exports = router;