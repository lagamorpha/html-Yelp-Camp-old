// vairables block
const express = require('express');
const passport = require('passport');
const router = express.Router();

// methods block
const users = require('../controllers/users');
const catchAsync = require('../utilities/catchAsync');
const { isLoggedIn } = require('../middleware');

// user registration router routes
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync (users.register));

// user login router routes
router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

// user logout routes
router.get('/logout', isLoggedIn, users.logout);

module.exports = router;