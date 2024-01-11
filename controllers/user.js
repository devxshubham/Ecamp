const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register')
}
module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = await new User({ username, email });
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if (err) next(err);
            else {
                req.flash('success', 'Registered successfully')
                res.redirect('/camp')
            }
        })

    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/register')
    }

}
module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back')
    const redirectTo = req.session.returnTo || '/camp';
    res.redirect(redirectTo)
}
module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', 'Logged Out')
        res.redirect('/camp');
    });
}