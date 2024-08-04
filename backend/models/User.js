const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    stripeCustomerId: { type: String },
    isSubscribed: { type: Boolean, default: false }
  });

module.exports = mongoose.model('User', userSchema);