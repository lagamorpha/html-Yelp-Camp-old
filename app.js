// Variable Block
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended:true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    console.log('Login to Root Page!');
    res.render('home');
});

// app.get('/makeCampground', async (req, res) => {
//     const camp = new Campground({title: 'My Backyard', description: 'cheap camping!'});
//     await camp.save();
//     console.log(`${camp.name} created!`);
//     res.send(camp);
// });

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    console.log('Login to Campgrounds Page!');
    res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/new', (re, res) => {
    console.log('Login to New Campground Page!')
    res.render('campgrounds/new');
});

app.post('/campgrounds', async (req, res) => {
    console.log('Creating New Campground!')
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
});

app.get('/campgrounds/:id', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    console.log(`Login to Campgrounds Page!`);
    res.render('campgrounds/show', { campground });
});

app.get('/campgrounds/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    console.log(`Login to Edit Campgrounds Page!`);
    res.render('campgrounds/edit', { campground });
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, { new: true });
    res.redirect(`/campgrounds/${campground._id}`);
    console.log('Editing Campground Page!');
    
});

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    console.log('Campground Deleted!');
    res.redirect('/campgrounds');
})

app.listen(3000, () => {
    console.log('Server Active on Port 3000!');
});