const express = require('express');
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const app = express();

// DB Connection
let MONGO_URL = 'mongodb://127.0.0.1:27017/Destination_select';
async function main() {
  await mongoose.connect(MONGO_URL);
}
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
app.get('/testListing', (req, res) => {
  let sampleListing = new Listing({
    title: 'Florican Room',
    description: 'Private room in farm stay',
    price: 5000,
    location: 'Nashik',
    country: 'India',
  });
  // sampleListing
  //   .save()
  //   .then((res) => {
  //     console.log(res);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
  res.send('working');
});
app.listen(8080, () => {
  console.log('Server listening on the port :8080');
});
