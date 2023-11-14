const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
    default:
      'https://img.freepik.com/free-photo/young-woman-hiker-taking-photo-with-smartphone-mountains-peak-winter_335224-427.jpg?w=996&t=st=1699977272~exp=1699977872~hmac=17a2fb163b8c33238a31d77736ec2ae0296a2b3a45e8c5255c9803e9a4e99c23',
    set: (v) =>
      v === ''
        ? 'https://img.freepik.com/free-photo/young-woman-hiker-taking-photo-with-smartphone-mountains-peak-winter_335224-427.jpg?w=996&t=st=1699977272~exp=1699977872~hmac=17a2fb163b8c33238a31d77736ec2ae0296a2b3a45e8c5255c9803e9a4e99c23'
        : v,
  },
  price: {
    type: String,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
});

const Listing = mongoose.model('Listing', listSchema);
module.exports = Listing;
