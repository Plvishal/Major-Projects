const Listing = require('../models/listing.js');
const { listingSchema } = require('../SchemaValidation.js');
module.exports.index = async (req, res) => {
  let allListing = await Listing.find();
  res.render('listing/index.ejs', { allListing });
};
module.exports.renderNewForm = (req, res) => {
  res.render('listing/new.ejs');
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: 'reviews', populate: { path: 'author' } })
    .populate('owner');
  if (!listing) {
    req.flash('error', 'Listing  does not exist !');
    res.redirect('/listings');
  }
  res.render('listing/show.ejs', { listing });
};
module.exports.createListing = async (req, res, next) => {
  // let listing = req.body.listing;
  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash('success', 'New Listing Created !!');
  res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash('error', 'Listing  does not exist !');
    return res.redirect('/listings');
  }
  res.render('listing/edit.ejs', { listing });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash('success', 'Listing Updated!');
  res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  req.flash('success', 'Listing Deleted!');
  // console.log(deleteListing);
  res.redirect('/listings');
};
