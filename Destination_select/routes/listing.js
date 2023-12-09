const experess = require('express');
const router = experess.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/Error/wrapAsync.js');
const ExpressError = require('../utils/Error/ExpressError.js');
const { listingSchema} = require('../SchemaValidation.js');
// server side validation for listings
const validationListing = (req, rex, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(404, errMsg);
  } else {
    next();
  }
};

// Index Route
router.get(
  '/',
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find();
    res.render('listing/index.ejs', { allListing });
  })
);
// New & Create Route
//
router.get(
  '/new',
  wrapAsync((req, res) => {
    res.render('listing/new.ejs');
  })
);
router.get(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate('reviews');
    res.render('listing/show.ejs', { listing });
  })
);
// Create New Route  When form Added
router.post(
  '/',
  wrapAsync(async (req, res, next) => {
    // let listing = req.body.listing;
    const resultError = listingSchema.validate(req.body);
    if (resultError.error) {
      throw new ExpressError(400, resultError.error);
    }
    const newListing = Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
  })
);

// Update: Edit/Edit Route (GET & PUT)
router.get(
  '/:id/edit',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    console.log(listing.image);
    res.render('listing/edit.ejs', { listing });
  })
);

// Update Route
router.put(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);
// Delete Listing: Delete Route
router.delete(
  '/:id',
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    // console.log(deleteListing);
    res.redirect('/listings');
  })
);

module.exports = router;
