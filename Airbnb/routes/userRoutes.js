const express = require('express');

const wrapAsync = require('../utils/Error/wrapAsync.js');
const userRouter = express.Router();
const passport = require('passport');
const { saveRedirect } = require('../middleware/userAuth.js');
const userController = require('../controllers/user.js');

userRouter.get('/signup', userController.renderSignUpForm);

userRouter.post('/signup', wrapAsync(userController.signUp));

userRouter.get('/login', userController.renderLoginForm);

userRouter.post(
  '/login',
  saveRedirect,
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  userController.logIn
);

userRouter.get('/logout', userController.logOut);
module.exports = userRouter;
