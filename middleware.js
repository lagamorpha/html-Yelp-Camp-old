// login verification middleware
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('You must be signed in to do this!');
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in to do this!');
        return res.redirect('/login');
    }
    console.log('User authenticated!');
    next();
}