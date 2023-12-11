const experess = require('express');
const routerListing = experess.Router();
const wrapAsync = require('../utils/Error/wrapAsync.js');
const isLoggedIn = require('../middleware/userAuth.js');
const { isOwner } = require('../middleware/userAuthorization.js');
const validationListing = require('../middleware/validationListing.js');

const validateReview = require('../middleware/validateReview.js');
const listingController = require('../controllers/listing.js');

// Index Route
routerListing.get('/', wrapAsync(listingController.index));
// New & Create Route
//
routerListing.get(
  '/new',
  isLoggedIn,
  wrapAsync(listingController.renderNewForm)
);
// show route
routerListing.get('/:id', wrapAsync(listingController.showListing));
// Create New Route  When form Added
routerListing.post('/', isLoggedIn, wrapAsync(listingController.createListing));

// Update: Edit/Edit Route (GET & PUT)
routerListing.get(
  '/:id/edit',
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

// Update Route
routerListing.put(
  '/:id',
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.updateListing)
);
// Delete Listing: Delete Route
routerListing.delete(
  '/:id',
  isOwner,
  isLoggedIn,
  wrapAsync(listingController.destroyListing)
);

module.exports = routerListing;
