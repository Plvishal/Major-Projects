const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
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

// Read:Show Route
app.get('/listings/:id', async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render('listing/show.ejs', { listing });
});
app.listen(8080, () => {
  console.log('Server listening on the port :8080');
});
