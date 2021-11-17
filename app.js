// Variable Block
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const app = express();

// Methods Block
const ExpressError = require('./utilities/ExpressError');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// Server Routes
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('Database Connected: yelp-camp!');
});

// Server Settings
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended:true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Session & Flash Settings
const sessionConfig = {
    secret: 'pickabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: (1000 * 60 * 60 * 24 * 7),
        httpOnly: true
    }
}
app.use(session(sessionConfig));
app.use(flash());

// Flash Message Middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Express Router Paths
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

// Home Route
app.get('/', (req, res) => {
    console.log('Login to Root Page!');
    res.render('home');
});

// Error Handlers

// Error 404 
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Error 500
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no, Something went wrong!';
    console.log(`Warning: ${err.statusCode} Error, ${err.message}!`);
    res.status(statusCode).render('error', { err });
});

// Server Ready Route
app.listen(3000, () => {
    console.log('Server Active on Port 3000!');
});