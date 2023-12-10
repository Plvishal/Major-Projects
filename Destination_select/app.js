const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/reviewRouter.js');
const session = require('express-session');
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
app.use(session(sessionOption));
// Create New Home  Routes
app.get('/', (req, res) => {
  res.send('Your home roots is working');
});

// Use here listing router
app.use('/listings', listingRouter);
// Use here Review router
app.use('/listings/:id/reviews', reviewRouter);
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
