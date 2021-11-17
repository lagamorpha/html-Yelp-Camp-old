// methods block
const User = require('../models/user');

// render register route export
module.exports.renderRegister = (req, res) => {
    console.log('Login to registration page!');
    res.render('users/register')
}

// register route export
module.exports.register = async (req, res, next) => {
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
            console.log(user);
            res.redirect('/campgrounds');
        });
    }
    catch (e)
    {
        console.log('Registration failed, please try again!');
        req.flash('error', e.message);
        res.redirect('register');
    }
}

// render login route export
module.exports.renderLogin = (req, res) => {
    console.log('Login to login page!');
    res.render('users/login');
}

// login route export
module.exports.login = (req, res) => {
    const { username } = req.body;
    console.log(`Login successful, welcome back ${username}!`);
    req.flash('success', `Login successful, welcome back ${username}!`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

// logout route export
module.exports.logout = (req, res) => {
    req.logout();
    console.log('Logout successful!');
    req.flash('success', 'Logout successful!');
    res.redirect('/campgrounds');
}
