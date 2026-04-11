const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/placement-portal-dev');

const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));

async function run() {
  const users = await User.find({});
  console.log("Users:", users);
  process.exit();
}
run();
