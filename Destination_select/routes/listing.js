const experess = require('express');
const Listing = require('../models/listing.js');
const routerListing = experess.Router();
const wrapAsync = require('../utils/Error/wrapAsync.js');
const ExpressError = require('../utils/Error/ExpressError.js');
const { listingSchema } = require('../SchemaValidation.js');
const isLoggedIn = require('../middleware/userAuth.js');
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

// Index Route
routerListing.get(
  '/',
  wrapAsync(async (req, res) => {
    let allListing = await Listing.find();
    res.render('listing/index.ejs', { allListing });
  })
);
// New & Create Route
//
routerListing.get(
  '/new',
  isLoggedIn,
  wrapAsync((req, res) => {
    res.render('listing/new.ejs');
  })
);
// show route
routerListing.get(
  '/:id', isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate('reviews')
      .populate('owner');
    if (!listing) {
      req.flash('error', 'Listing  does not exist !');
      res.redirect('/listings');
    }
    res.render('listing/show.ejs', { listing });
  })
);
// Create New Route  When form Added
routerListing.post(
  '/',
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    // let listing = req.body.listing;
    const resultError = listingSchema.validate(req.body);
    if (resultError.error) {
      throw new ExpressError(400, resultError.error);
    }
    const newListing = Listing(req.body.listing);
    newListing.owner=req.user._id
    await newListing.save();
    req.flash('success', 'New Listing Created !!');
    res.redirect('/listings');
  })
);

// Update: Edit/Edit Route (GET & PUT)
routerListing.get(
  '/:id/edit',
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash('error', 'Listing  does not exist !');
      res.redirect('/listings');
    }
    res.render('listing/edit.ejs', { listing });
  })
);

// Update Route
routerListing.put(
  '/:id',
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash('success', 'Listing Updated!');
    res.redirect(`/listings/${id}`);
  })
);
// Delete Listing: Delete Route
routerListing.delete(
  '/:id',
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing Deleted!');
    // console.log(deleteListing);
    res.redirect('/listings');
  })
);

module.exports = routerListing;
