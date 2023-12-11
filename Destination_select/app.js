if (process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const routerListing = require('./routes/listing.js');
const reviewRouter = require('./routes/reviewRouter.js');
const userRouter = require('./routes/userRoutes.js');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStretegy = require('passport-local');
const User = require('./models/user.js');
const path = require('path');
const app = express();

// DB Connection
let MONGO_URL = 'mongodb://127.0.0.1:27017/Destination_select';
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log('Connection Successful!!');
  })
  .catch((err) => {
    console.log(err);
  });

// Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// when data comes in URL it is required
app.use(express.urlencoded({ extended: true }));
// For the method override
app.use(methodOverride('_method'));

// EJS  Mate use
app.engine('ejs', ejsMate);
//  for the static use like CSS and JS
app.use(express.static(path.join(__dirname, '/public')));

const sessionOption = {
  secret: 'mysupersecreatstring',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge: 1000 * 60 * 60 * 24 * 3,
    httpOnly: true,
  },
};
// Create New Home  Routes
app.get('/', (req, res) => {
  res.send('Your home roots is working');
});

app.use(session(sessionOption));
app.use(flash());

// Passport Implementation
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStretegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// create middleware for flash
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;

  next();
});
// app.get('/demo', async (req, res) => {
//   let fakeUser = new User({
//     email: 'vp@gmail.com',
//     username: 'vishal',
//   });
//   let registerUser = await User.register(fakeUser, 'vishal123');
//   res.send(registerUser);
// });

// Use here listing router
app.use('/listings', routerListing);
// Use here Review router
app.use('/listings/:id/reviews', reviewRouter);
// user router
app.use('/', userRouter);
// Read:Show Route

// Review  post Route

// Error Handling
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page not found'));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message } = err;
  res.render('error.ejs', { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log('Server listening on the port :8080');
});
