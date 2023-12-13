const UserModel = require('../models/user.js');

module.exports.renderSignUpForm = (req, res) => {
  res.render('users/signup.ejs');
};
module.exports.signUp = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new UserModel({ email, username });
    const registerUser = await UserModel.register(newUser, password);
    req.login(registerUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'Welcame to Wonderlust');
      res.redirect('/listings');
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/signup');
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render('users/login.ejs');
};
module.exports.logIn = async (req, res) => {
  req.flash('success', 'Welcome to woderlust ');
  let redirectUrl = res.locals.redirectUrl || '/listings';
  res.redirect(redirectUrl);
};

module.exports.logOut = (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You are logged out now');
    res.redirect('/listings');
  });
};
