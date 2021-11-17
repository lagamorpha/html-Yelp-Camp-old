// dotenv statement
if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// console.log(process.env.CLOUDINARY_CLOUD_NAME);
// console.log(process.env.CLOUDINARY_KEY);
// console.log(process.env.CLOUDINARY_SECRET);
// console.log(process.env.MAPBOX_TOKEN);

// Variable Block
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local');

// Methods Block
const User = require('./models/user');
const ExpressError = require('./utilities/ExpressError');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')

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

// app.use statements
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// passport methods setup
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());passport.deserializeUser(User.deserializeUser());

// Flash Message Middleware
app.use((req, res, next) => {
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// simulated user statement
app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'cowsnutz@notafakeemail.com', username: 'michael'});
    const newUser = await User.register(user, 'nugget');
    console.log(newUser);
    res.send(newUser);
});

// Express Router Paths
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

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