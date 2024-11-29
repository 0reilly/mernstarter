const mongoose = require('mongoose');

const UserLogSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  source: {
    type: String,
    enum: ['iframe', 'direct'],
    required: true
  }
});

module.exports = mongoose.model('UserLog', UserLogSchema); 