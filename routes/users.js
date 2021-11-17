// vairables block
const express = require('express');
const passport = require('passport');
const router = express.Router();

// methods block
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn } = require('../middleware');


// user registration routes
router.get('/register', (req, res) => {
    console.log('Login to regristration page!');
    res.render('users/register')
});

router.post('/register', catchAsync ( async (req, res, next) => {
    try 
    {
        const { email, username, password } = req.body;
        const user = new User({email, username});
        console.log('Registering new user data');
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            console.log('Registration successful, welcome to Yelp Yamp!');
            req.flash('success', `Welcome to Yelp Camp ${registeredUser.username}!`);
            res.redirect('/campgrounds');
        });
    }
    catch (e)
    {
        console.log('Registration failed, please try again!');
        req.flash('error', e.message);
        res.redirect('register');
    }
    
}));

// user login routes
router.get('/login', (req, res) => {
    console.log('Login to login page!');
    res.render('users/login');
});

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    const { username } = req.body;
    console.log(`Login successful, welcome back ${username}!`);
    req.flash('success', `Login successful, welcome back ${username}!`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

// user logout routes
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    console.log('Logout successful!');
    req.flash('success', 'Logout successful!');
    res.redirect('/campgrounds');
});

module.exports = router;