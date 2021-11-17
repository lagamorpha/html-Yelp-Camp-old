// Variables Block
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mapBoxToken });

// Methods Block
const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");

// index route export
module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    console.log('Login to Campgrounds Index Page!');
    res.render('campgrounds/index', { campgrounds });
}

// render new form route export
module.exports.renderNewForm = (req, res) => {
    console.log('Login to New Campground Page!');
    res.render('campgrounds/new');
}

// create campground route export
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', `Successfully created ${campground.title} campground page!`);
    console.log('Campground saved!');
    console.log(campground);
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
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { new: true });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
        console.log(campground);
    }
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
