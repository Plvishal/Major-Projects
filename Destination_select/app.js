const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const app = express();

// DB Connection
let MONGO_URL = 'mongodb://127.0.0.1:27017/Destination_select';
async function main() {
  await mongoose.connect(MONGO_URL);
}
// Set EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// when data comes in URL it is required
app.use(express.urlencoded({ extended: true }));
// For the method override
app.use(methodOverride('_method'));
// EJS  Mate use
app.engine('ejs', ejsMate);
//  for the static use like CSS and JS
app.use(express.static(path.join(__dirname, '/public')));

main()
  .then(() => {
    console.log('Connection Successful!!');
  })
  .catch((err) => {
    console.log(err);
  });
// Create New Home  Routes
app.get('/', (req, res) => {
  res.send('Your home roots is working');
});
// Create new for testListing
// app.get('/testListing', async(req, res) => {
//   let sampleListing = new Listing({
//     title: 'Florican Room',
//     description: 'Private room in farm stay',
//     price: 5000,
//     location: 'Nashik',
//     country: 'India',
//   });
//   // await sampleListing
//   //   .save()
//   //   .then((res) => {
//   //     console.log(res);
//   //   })
//   //   .catch((err) => {
//   //     console.log(err);
//   //   });
//   res.send('working');
// });

// Index Route
app.get('/listings', async (req, res) => {
  let allListing = await Listing.find();
  res.render('listing/index.ejs', { allListing });
});
// New & Create Route
//
app.get('/listings/new', (req, res) => {
  res.render('listing/new.ejs');
});

// Read:Show Route
app.get('/listings/:id', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listing/show.ejs', { listing });
});
// Create New Route  When form Added
app.post('/listings', async (req, res, next) => {
  // let listing = req.body.listing;
  try {
    const newListing = Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
  } catch (err) {
    next(err);
  }
});

// Update: Edit/Edit Route (GET & PUT)
app.get('/listings/:id/edit', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  console.log(listing);
  console.log(listing.image);
  res.render('listing/edit.ejs', { listing });
});

// Update Route
app.put('/listings/:id', async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});
// Delete Listing: Delete Route
app.delete('/listings/:id', async (req, res) => {
  let { id } = req.params;
  let deleteListing = await Listing.findByIdAndDelete(id);
  // console.log(deleteListing);
  res.redirect('/listings');
});

// Error Handling
app.use((err, req, res, next) => {
  res.send('Something went wrong');
});

app.listen(8080, () => {
  console.log('Server listening on the port :8080');
});
