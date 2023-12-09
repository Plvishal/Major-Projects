const express = require('express');
const reviewRouter = express.Router({ mergeParams: true });

const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/Error/wrapAsync.js');
const ExpressError = require('../utils/Error/ExpressError.js');
const { reviewSchema } = require('../SchemaValidation.js');

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
reviewRouter.post(
  '/',
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
reviewRouter.delete(
  '/:reviewId',
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
  })
);

module.exports = reviewRouter;
