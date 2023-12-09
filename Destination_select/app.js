const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');

const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/Error/wrapAsync.js');
const ExpressError = require('./utils/Error/ExpressError.js');
const { listingSchema, reviewSchema } = require('./SchemaValidation.js');
const listingRoute = require('./routes/listing.js');
const path = require('path');
const app = express();

// DB Connection
let MONGO_URL = 'mongodb://127.0.0.1:27017/Destination_select';
async function main() {
  await mongoose.connect(MONGO_URL);
}
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

main()
  .then(() => {
    console.log('Connection Successful!!');
  })
  .catch((err) => {
    console.log(err);
  });
// Create New Home  Routes
app.get('/', (req, res) => {
  res.send('Your home roots is working');
});

// server side validation for reviews
const validationReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};
// Use here listing router
app.use('/listings', listingRoute);

// Read:Show Route

// Review  post Route
app.post(
  '/listings/:id/reviews',
  validationReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
  })
);
// Delete Route for Reviews
app.delete(
  '/listings/:id/reviews/:reviewId',
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);
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
