const { listingSchema } = require('../SchemaValidation.js');
const ExpressError = require('../utils/Error/ExpressError.js');
// server side validation for listings
const validationListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};
module.exports = validationListing;
