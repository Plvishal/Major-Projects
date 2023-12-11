const Review = require('../models/review.js');
// onwer U
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash('error', 'You  are not author of this review ');
    return res.redirect(`/listings/${id}`);
  }
  next();
};
