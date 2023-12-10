const express = require('express');
const userRouter = express.Router();

userRouter.get('/signup', (req, res) => {
  res.render('users/signup.ejs');
});
module.exports = userRouter;
