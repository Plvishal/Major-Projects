const express = require('express');
const reviewRouter = express.Router({ mergeParams: true });

const wrapAsync = require('../utils/Error/wrapAsync.js');
const validationReview = require('../middleware/validateReview.js');
const isloggedIn = require('../middleware/userAuth.js');
const { isReviewAuthor } = require('../middleware/isReviewAuthor.js');
const reviewController = require('../controllers/reviews.js');

reviewRouter.post(
  '/',
  isloggedIn,
  validationReview,
  wrapAsync(reviewController.createReview)
);
// Delete Route for Reviews
reviewRouter.delete(
  '/:reviewId',
  isloggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.deleteReview)
);

module.exports = reviewRouter;
