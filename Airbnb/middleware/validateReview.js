const { reviewSchema } = require('../SchemaValidation.js');
const ExpressError = require('../utils/Error/ExpressError.js');

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

module.exports = validationReview;
