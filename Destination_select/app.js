const express = require('express');
const mongoose = require('mongoose');
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
app.listen(8080, () => {
  console.log('Server listening on the port :8080');
});
