const Listing = require("../models/listing.js");
module.exports.index=async (req, res) => {
    let allListing = await Listing.find();
    res.render('listing/index.ejs', { allListing });
  }