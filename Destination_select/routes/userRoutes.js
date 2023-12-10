const express = require('express');
const UserModel = require('../Models/user.js');
const wrapAsync = require('../utils/Error/wrapAsync');
const userRouter = express.Router();

userRouter.get('/signup', (req, res) => {
  res.render('users/signup.ejs');
});

userRouter.post(
  '/signup',
  wrapAsync(async (req, res) => {
    try {
      let { username, email, password } = req.body;
      const newUser = new UserModel({ email, username });
      const registerUser = await UserModel.register(newUser, password);
      console.log(registerUser);
      req.flash('success', 'Welcame to Wonderlust');
      res.redirect('/listings');
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('/signup');
    }
  })
);
module.exports = userRouter;
