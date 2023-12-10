const express = require('express');
const UserModel = require('../Models/user.js');
const wrapAsync = require('../utils/Error/wrapAsync.js');
const userRouter = express.Router();
const passport = require('passport');

userRouter.get('/signup', (req, res) => {
  res.render('users/signup.ejs');
});

userRouter.post(
  '/signup',
  wrapAsync(async (req, res, next) => {
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
  })
);

userRouter.get('/login', (req, res) => {
  res.render('users/login.ejs');
});

userRouter.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash('success', 'Welcome to woderlust ');
    res.redirect('/listings');
  }
);

userRouter.get('/logout', (req, res, next) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'You are logged out now');
    res.redirect('/listings');
  });
});
module.exports = userRouter;
