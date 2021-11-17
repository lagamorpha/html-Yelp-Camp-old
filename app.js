const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema } = require('./schemas.js')
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campground');

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

const validatCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    console.log('Validating campground data!');
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        console.log('Campground data validated!');
        next();
    }
    // console.log(result);
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
    console.log('Login to New Campground Page!')
    res.render('campgrounds/new');
});

app.post('/campgrounds', validatCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    console.log('Campground saved!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    console.log(`Login to Campgrounds Page!`);
    res.render('campgrounds/show', { campground });
}));

app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    console.log(`Login to Edit Campgrounds Page!`);
    res.render('campgrounds/edit', { campground });
}));

app.put('/campgrounds/:id', validatCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { new: true });
    console.log('Editing Campground Page!');
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id', validatCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    console.log('Campground Deleted!');
    res.redirect('/campgrounds');
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