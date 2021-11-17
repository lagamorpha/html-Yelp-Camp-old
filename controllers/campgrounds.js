// Methods Block
const Campground = require('../models/campground');

// index route export
module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    console.log('Login to Campgrounds Page!');
    res.render('campgrounds/index', { campgrounds });
}

// render new form route export
module.exports.renderNewForm = (req, res) => {
    console.log('Login to New Campground Page!');
    res.render('campgrounds/new');
}

// create campground route export
module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', `Successfully created ${campground.title} campground page!`);
    console.log('Campground saved!');
    res.redirect(`/campgrounds/${campground._id}`);
}

// show campground route export
module.exports.showCampground = async (req, res, next) => {
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
}

// render edit form route export
module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Cannot find that campground, redirecting to index!');
        console.log('Cannot find that campground, redirecting to index!');
        return res.redirect('/campgrounds');
    }
    console.log(`Login to Edit Campgrounds Page!`);
    res.render('campgrounds/edit', { campground });
}

// update campground route export
module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { new: true });
    req.flash('success', `Successfully updated ${campground.title} campground page!`);
    console.log('Editing Campground Page!');
    res.redirect(`/campgrounds/${campground._id}`);
}

// delete campground route export
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully deleted ${deletedCampground.title} Campground Page and Reviews!`);
    console.log(`${deletedCampground} Deleted`);
    res.redirect('/campgrounds');
}
