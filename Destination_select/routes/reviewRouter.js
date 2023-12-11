const express = require('express');
const reviewRouter = express.Router({ mergeParams: true });

const Review = require('../models/review.js');
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/Error/wrapAsync.js');
const validationReview = require('../middleware/validateReview.js');

reviewRouter.post(
  '/',
  validationReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    req.flash('success', ' New Reviews Created');
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
    req.flash('success', 'Review Deleted');
    res.redirect(`/listings/${id}`);
  })
);

module.exports = reviewRouter;
